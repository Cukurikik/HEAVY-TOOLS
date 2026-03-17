"""
ANITA Code Fixer
Debug dan perbaiki kode dalam bahasa apa pun secara otomatis
Gunakan: python3 anita_fix.py [file]
"""

import os
import sys
import subprocess
from pathlib import Path

try:
    import anthropic
    from rich.console import Console
    from rich.panel import Panel
    from rich.syntax import Syntax
    from rich.columns import Columns
    from rich.prompt import Confirm
except ImportError:
    print("pip install anthropic rich")
    sys.exit(1)

console = Console()

FIXER_PROMPT = """Kamu adalah ANITA Code Fixer — spesialis debugging semua bahasa pemrograman.

Kamu akan menerima:
- Kode yang bermasalah
- Pesan error (jika ada)

TUGASMU:
1. Identifikasi SEMUA bug, error, dan masalah
2. Jelaskan setiap masalah secara singkat
3. Berikan kode yang sudah diperbaiki LENGKAP (bukan partial)
4. Jelaskan apa yang kamu ubah

Format output:
## Masalah Ditemukan
- [daftar masalah]

## Perbaikan
[penjelasan singkat perubahan]

## Kode Fixed
```[bahasa]
[kode lengkap yang sudah diperbaiki]
```"""


def load_env():
    env_file = Path(".env")
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip())


def detect_language(filepath: Path) -> str:
    ext_map = {
        ".py": "python", ".js": "javascript", ".ts": "typescript",
        ".java": "java", ".c": "c", ".cpp": "cpp", ".rs": "rust",
        ".go": "go", ".rb": "ruby", ".php": "php", ".swift": "swift",
        ".kt": "kotlin", ".kts": "kotlin", ".sh": "bash",
        ".r": "r", ".pl": "perl", ".lua": "lua", ".dart": "dart",
        ".hs": "haskell", ".ex": "elixir", ".exs": "elixir",
        ".scala": "scala", ".jl": "julia", ".cs": "csharp",
        ".ps1": "powershell", ".sql": "sql",
    }
    return ext_map.get(filepath.suffix.lower(), "text")


def run_code(filepath: Path, language: str) -> tuple[str, str, int]:
    """Coba jalankan kode, tangkap error."""
    runners = {
        "python": ["python3", str(filepath)],
        "javascript": ["node", str(filepath)],
        "ruby": ["ruby", str(filepath)],
        "php": ["php", str(filepath)],
        "go": ["go", "run", str(filepath)],
        "bash": ["bash", str(filepath)],
        "lua": ["lua", str(filepath)],
        "perl": ["perl", str(filepath)],
        "elixir": ["elixir", str(filepath)],
        "julia": ["julia", str(filepath)],
    }
    cmd = runners.get(language)
    if not cmd:
        return "", "", -1

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        return result.stdout, result.stderr, result.returncode
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        return "", str(e), 1


def fix_code(code: str, language: str, error_msg: str = "") -> str:
    """Kirim ke ANITA untuk diperbaiki."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        console.print("[red]Set ANTHROPIC_API_KEY dulu![/red]")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    prompt = f"Bahasa: {language}\n\nKode:\n```{language}\n{code}\n```"
    if error_msg:
        prompt += f"\n\nError Message:\n```\n{error_msg}\n```"

    console.print("\n[cyan]⚡ ANITA sedang menganalisis dan memperbaiki...[/cyan]\n")

    full_response = ""
    with client.messages.stream(
        model="claude-opus-4-5",
        max_tokens=8096,
        system=FIXER_PROMPT,
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            full_response += text
    print()

    return full_response


def extract_fixed_code(response: str) -> str | None:
    """Ekstrak kode yang sudah diperbaiki dari respons."""
    import re
    pattern = r"```(?:\w+)?\n([\s\S]*?)```"
    matches = re.findall(pattern, response)
    if matches:
        return matches[-1].strip()  # Ambil code block terakhir (yang fixed)
    return None


def main():
    load_env()

    if len(sys.argv) < 2:
        console.print(Panel(
            "[bold cyan]ANITA Code Fixer[/bold cyan]\n\n"
            "Usage:\n"
            "  [yellow]python3 anita_fix.py kode_saya.py[/yellow]     → Fix file\n"
            "  [yellow]python3 anita_fix.py kode.js --run[/yellow]    → Fix + jalankan\n"
            "  [yellow]python3 anita_fix.py kode.go --auto[/yellow]   → Fix + simpan otomatis",
            border_style="cyan"
        ))
        sys.exit(0)

    filepath = Path(sys.argv[1])
    auto_run = "--run" in sys.argv
    auto_save = "--auto" in sys.argv

    if not filepath.exists():
        console.print(f"[red]File tidak ditemukan: {filepath}[/red]")
        sys.exit(1)

    language = detect_language(filepath)
    code = filepath.read_text(encoding="utf-8")

    # Tampilkan kode asli
    console.print(Panel(
        Syntax(code, language, theme="monokai", line_numbers=True),
        title=f"[yellow]Kode Asli — {filepath.name} ({language})[/yellow]",
        border_style="yellow"
    ))

    # Coba jalankan dulu untuk dapat error message
    error_msg = ""
    if language in ("python", "javascript", "ruby", "php", "go", "bash", "lua"):
        console.print(f"\n[dim]Mencoba menjalankan untuk deteksi error...[/dim]")
        stdout, stderr, code_exit = run_code(filepath, language)
        if code_exit != 0 and stderr:
            error_msg = stderr
            console.print(Panel(stderr[:500], title="[red]Error Terdeteksi[/red]", border_style="red"))
        elif code_exit == 0:
            console.print(f"[green]✓ Kode berjalan tanpa error![/green]")
            if not Confirm.ask("Tetap ingin dianalisis ANITA?", default=False):
                return

    # Fix dengan ANITA
    response = fix_code(code, language, error_msg)

    # Ekstrak kode fixed
    fixed_code = extract_fixed_code(response)
    if fixed_code:
        fixed_path = filepath.with_stem(filepath.stem + "_fixed")

        if auto_save or Confirm.ask(f"\n[yellow]Simpan kode fixed ke {fixed_path.name}?[/yellow]", default=True):
            fixed_path.write_text(fixed_code, encoding="utf-8")
            console.print(f"[green]✓ Disimpan: {fixed_path}[/green]")

            if auto_run or Confirm.ask("[yellow]Jalankan kode fixed?[/yellow]", default=False):
                console.print(f"\n[bold]▶ Menjalankan {fixed_path.name}...[/bold]")
                stdout, stderr, exit_code = run_code(fixed_path, language)
                if stdout:
                    console.print(Panel(stdout, title="[green]Output[/green]", border_style="green"))
                if stderr:
                    console.print(Panel(stderr, title="[red]Error[/red]", border_style="red"))
                status = "[green]✓ Berhasil[/green]" if exit_code == 0 else f"[red]✗ Exit {exit_code}[/red]"
                console.print(status)


if __name__ == "__main__":
    main()
