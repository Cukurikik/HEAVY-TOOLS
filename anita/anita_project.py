"""
ANITA Project Generator
Buat scaffold proyek lengkap untuk bahasa/framework apa pun
Gunakan: python3 anita_project.py
"""

import os
import sys
import json
from pathlib import Path
from typing import Optional

try:
    import anthropic
    from rich.console import Console
    from rich.panel import Panel
    from rich.prompt import Prompt, Confirm
    from rich.tree import Tree
except ImportError:
    print("pip install anthropic rich")
    sys.exit(1)

console = Console()

GENERATOR_PROMPT = """Kamu adalah ANITA Project Generator.
Tugas: Buat struktur proyek LENGKAP dan SIAP JALAN untuk request user.

ATURAN:
1. Hasilkan SEMUA file yang diperlukan — jangan skip
2. Setiap file harus berisi kode LENGKAP, bukan placeholder
3. Sertakan: README.md, requirements/package manager file, konfigurasi
4. Kode harus production-ready dengan error handling
5. Format output WAJIB JSON seperti ini:

{
  "project_name": "nama_proyek",
  "description": "deskripsi singkat",
  "language": "bahasa utama",
  "framework": "framework jika ada",
  "install_commands": ["pip install ...", "npm install ..."],
  "run_command": "cara menjalankan",
  "files": [
    {
      "path": "relative/path/file.py",
      "content": "isi kode lengkap di sini"
    }
  ]
}

PENTING: Hanya output JSON, tidak ada teks lain di luar JSON."""


def load_env():
    env_file = Path(".env")
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip())


def generate_project(description: str, output_dir: Optional[str] = None) -> dict:
    """Generate proyek lengkap menggunakan ANITA."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        console.print("[red]Set ANTHROPIC_API_KEY dulu![/red]")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    console.print(f"\n[cyan]⚡ ANITA sedang generate proyek...[/cyan]")
    console.print(f"[dim]Request: {description}[/dim]\n")

    with console.status("[bold cyan]Generating...[/bold cyan]"):
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=16000,
            system=GENERATOR_PROMPT,
            messages=[{"role": "user", "content": description}]
        )

    raw = response.content[0].text.strip()

    # Bersihkan jika ada wrapper markdown
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        project = json.loads(raw)
    except json.JSONDecodeError as e:
        console.print(f"[red]Error parsing JSON: {e}[/red]")
        console.print("[dim]Raw response:[/dim]")
        console.print(raw[:500])
        sys.exit(1)

    return project


def write_project(project: dict, base_dir: Optional[Path] = None):
    """Tulis semua file proyek ke disk."""
    name = project.get("project_name", "anita_project")
    base = base_dir or Path(name)
    base.mkdir(parents=True, exist_ok=True)

    # Tampilkan tree
    tree = Tree(f"[bold cyan]{name}/[/bold cyan]")

    files_written = []
    for file_info in project.get("files", []):
        rel_path = file_info["path"]
        content = file_info["content"]
        full_path = base / rel_path

        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content, encoding="utf-8")
        files_written.append(full_path)

        # Tambah ke tree
        parts = Path(rel_path).parts
        node = tree
        for part in parts[:-1]:
            node = node.add(f"[blue]{part}/[/blue]")
        node.add(f"[green]{parts[-1]}[/green] [dim]({len(content):,} chars)[/dim]")

    console.print(tree)
    console.print(f"\n[green]✓ {len(files_written)} file ditulis ke [bold]{base}/[/bold][/green]")

    # Tampilkan info
    if project.get("description"):
        console.print(f"\n[white]{project['description']}[/white]")

    if project.get("install_commands"):
        console.print("\n[yellow]Install dependensi:[/yellow]")
        for cmd in project["install_commands"]:
            console.print(f"  [dim]$[/dim] [cyan]{cmd}[/cyan]")

    if project.get("run_command"):
        console.print(f"\n[yellow]Jalankan:[/yellow]")
        console.print(f"  [dim]$[/dim] [cyan]{project['run_command']}[/cyan]")

    return base


def main():
    load_env()

    console.print(Panel(
        "[bold cyan]⚡ ANITA Project Generator[/bold cyan]\n"
        "Generate proyek lengkap dalam bahasa & framework apa pun",
        border_style="cyan"
    ))

    print()
    description = Prompt.ask(
        "[bold]Deskripsikan proyek yang ingin dibuat[/bold]\n"
        "[dim]Contoh: REST API Python FastAPI dengan PostgreSQL dan JWT auth[/dim]\n"
        "▶"
    )

    if not description.strip():
        console.print("[red]Deskripsi tidak boleh kosong.[/red]")
        return

    output = Prompt.ask(
        "\n[yellow]Folder output[/yellow]",
        default=""
    )

    project = generate_project(description)
    base = write_project(project, Path(output) if output else None)

    if Confirm.ask("\n[yellow]Buka folder output?[/yellow]", default=False):
        import subprocess, platform
        if platform.system() == "Darwin":
            subprocess.run(["open", str(base)])
        elif platform.system() == "Linux":
            subprocess.run(["xdg-open", str(base)])
        elif platform.system() == "Windows":
            subprocess.run(["explorer", str(base)])


if __name__ == "__main__":
    main()
