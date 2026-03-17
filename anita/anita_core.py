"""
ANITA - Artificial Neural Intelligence & Technology Assistant
Core AI Engine — menggunakan Anthropic Claude API
"""

import os
import re
import json
import subprocess
import tempfile
import platform
from pathlib import Path
from datetime import datetime
from typing import Optional

try:
    import anthropic
except ImportError:
    print("Install dulu: pip install anthropic rich prompt_toolkit")
    exit(1)

try:
    from rich.console import Console
    from rich.syntax import Syntax
    from rich.panel import Panel
    from rich.markdown import Markdown
    from rich.table import Table
    from rich import print as rprint
    from rich.live import Live
    from rich.spinner import Spinner
except ImportError:
    print("Install dulu: pip install rich")
    exit(1)


console = Console()

# ── Pemetaan ekstensi file per bahasa ──────────────────────────────────────
LANGUAGE_MAP = {
    "python": {"ext": ".py",   "run": ["python3", "{file}"]},
    "javascript": {"ext": ".js",   "run": ["node", "{file}"]},
    "typescript": {"ext": ".ts",   "run": ["ts-node", "{file}"]},
    "java": {"ext": ".java", "run": ["javac", "{file}", "&&", "java", "{class}"]},
    "c": {"ext": ".c",    "run": ["gcc", "{file}", "-o", "{out}", "&&", "./{out}"]},
    "cpp": {"ext": ".cpp",  "run": ["g++", "{file}", "-o", "{out}", "&&", "./{out}"]},
    "c++": {"ext": ".cpp",  "run": ["g++", "{file}", "-o", "{out}", "&&", "./{out}"]},
    "rust": {"ext": ".rs",   "run": ["rustc", "{file}", "-o", "{out}", "&&", "./{out}"]},
    "go": {"ext": ".go",   "run": ["go", "run", "{file}"]},
    "ruby": {"ext": ".rb",   "run": ["ruby", "{file}"]},
    "php": {"ext": ".php",  "run": ["php", "{file}"]},
    "swift": {"ext": ".swift","run": ["swift", "{file}"]},
    "kotlin": {"ext": ".kts",  "run": ["kotlinc-jvm", "-script", "{file}"]},
    "bash": {"ext": ".sh",   "run": ["bash", "{file}"]},
    "shell": {"ext": ".sh",   "run": ["bash", "{file}"]},
    "r": {"ext": ".r",    "run": ["Rscript", "{file}"]},
    "perl": {"ext": ".pl",   "run": ["perl", "{file}"]},
    "lua": {"ext": ".lua",  "run": ["lua", "{file}"]},
    "dart": {"ext": ".dart", "run": ["dart", "run", "{file}"]},
    "haskell": {"ext": ".hs",   "run": ["runhaskell", "{file}"]},
    "elixir": {"ext": ".exs",  "run": ["elixir", "{file}"]},
    "scala": {"ext": ".scala","run": ["scala", "{file}"]},
    "julia": {"ext": ".jl",   "run": ["julia", "{file}"]},
    "sql": {"ext": ".sql",  "run": None},
    "html": {"ext": ".html", "run": None},
    "css": {"ext": ".css",  "run": None},
    "csharp": {"ext": ".cs",   "run": ["dotnet-script", "{file}"]},
    "c#": {"ext": ".cs",   "run": ["dotnet-script", "{file}"]},
    "powershell": {"ext": ".ps1",  "run": ["pwsh", "-File", "{file}"]},
    "matlab": {"ext": ".m",    "run": ["matlab", "-batch", "run('{file}')"]},
}

SYSTEM_PROMPT = """Kamu adalah ANITA (Artificial Neural Intelligence & Technology Assistant), 
AI coding assistant terbaik yang menguasai SEMUA bahasa pemrograman dan teknologi.

ATURAN UTAMA:
1. Selalu tulis kode yang LENGKAP, BERSIH, dan LANGSUNG BISA DIJALANKAN
2. Tambahkan komentar yang jelas di setiap bagian penting
3. Tangani error dengan try/except atau mekanisme error handling yang sesuai bahasanya
4. Jika diminta membuat sistem besar, buat file-file yang terpisah dengan struktur yang baik
5. Selalu sebutkan dependensi yang perlu diinstall
6. Kode harus production-ready, bukan contoh mainan
7. Jika ada pilihan bahasa, pilih yang paling tepat untuk kasus tersebut
8. Format kode selalu dalam markdown code block dengan nama bahasa yang benar

KEMAMPUAN:
- Semua bahasa: Python, JS, TS, Java, C, C++, Rust, Go, Ruby, PHP, Swift, Kotlin, dll
- Framework: React, Vue, Django, FastAPI, Spring, Flutter, dll
- Database: SQL, NoSQL, Redis, GraphQL
- AI/ML: TensorFlow, PyTorch, Scikit-learn, Transformers
- DevOps: Docker, Kubernetes, CI/CD
- Security: Enkripsi, Auth, API Security
- System programming, embedded, networking

Saat membuat kode, SELALU mulai dengan penjelasan singkat apa yang akan dibuat, 
lalu langsung ke kode lengkapnya."""


class ANITAAssistant:
    def __init__(self, api_key: Optional[str] = None):
        # Use provided key or fetch from environment variable
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")

        if not self.api_key:
            console.print("[red]ANTHROPIC_API_KEY not found in environment or arguments.[/red]")
            exit(1)

        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.history = []
        self.session_dir = Path("anita_output") / datetime.now().strftime("%Y%m%d_%H%M%S")
        self.session_dir.mkdir(parents=True, exist_ok=True)
        self.file_counter = 0

    def _extract_code_blocks(self, text: str) -> list[dict]:
        """Ekstrak semua code block dari respons."""
        pattern = r"```(\w+)?\n([\s\S]*?)```"
        matches = re.findall(pattern, text)
        blocks = []
        for lang, code in matches:
            blocks.append({
                "language": lang.lower() if lang else "text",
                "code": code.strip()
            })
        return blocks

    def _save_code(self, code: str, language: str, filename: Optional[str] = None) -> Path:
        """Simpan kode ke file."""
        lang_info = LANGUAGE_MAP.get(language, {"ext": ".txt"})
        ext = lang_info["ext"]

        if filename:
            filepath = self.session_dir / filename
        else:
            self.file_counter += 1
            filepath = self.session_dir / f"anita_{self.file_counter:03d}{ext}"

        filepath.write_text(code, encoding="utf-8")
        return filepath

    def _run_code(self, filepath: Path, language: str) -> tuple[str, str, int]:
        """Jalankan file kode dan kembalikan stdout, stderr, returncode."""
        lang_info = LANGUAGE_MAP.get(language, {})
        run_cmd = lang_info.get("run")

        if not run_cmd:
            return "", f"Bahasa {language} tidak bisa dijalankan langsung (perlu browser/IDE)", 0

        # Build command
        out_path = filepath.with_suffix("")
        class_name = filepath.stem
        cmd = []
        for part in run_cmd:
            part = part.replace("{file}", str(filepath))
            part = part.replace("{out}", str(out_path))
            part = part.replace("{class}", class_name)
            cmd.append(part)

        # Handle compound commands (&&)
        if "&&" in cmd:
            full_cmd = " ".join(cmd)
            result = subprocess.run(
                full_cmd, shell=True, capture_output=True, text=True, timeout=30
            )
        else:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=30
            )

        return result.stdout, result.stderr, result.returncode

    def chat(self, user_message: str, stream: bool = True) -> str:
        """Kirim pesan ke ANITA dan dapatkan respons."""
        self.history.append({"role": "user", "content": user_message})

        full_response = ""

        if stream:
            console.print("\n[bold cyan]ANITA:[/bold cyan]")
            with self.client.messages.stream(
                model="claude-opus-4-5",
                max_tokens=8096,
                system=SYSTEM_PROMPT,
                messages=self.history
            ) as stream_obj:
                for text in stream_obj.text_stream:
                    print(text, end="", flush=True)
                    full_response += text
            print()
        else:
            response = self.client.messages.create(
                model="claude-opus-4-5",
                max_tokens=8096,
                system=SYSTEM_PROMPT,
                messages=self.history
            )
            full_response = response.content[0].text

        self.history.append({"role": "assistant", "content": full_response})
        return full_response

    def process_response(self, response: str, auto_save: bool = True, auto_run: bool = False):
        """Proses respons: tampilkan, simpan, dan opsional jalankan kode."""
        code_blocks = self._extract_code_blocks(response)

        if not code_blocks:
            return

        console.print(f"\n[green]✓ Ditemukan {len(code_blocks)} blok kode[/green]")

        saved_files = []
        for i, block in enumerate(code_blocks):
            lang = block["language"]
            code = block["code"]

            if lang in ("text", "plaintext", ""):
                continue

            if auto_save:
                filepath = self._save_code(code, lang)
                saved_files.append((filepath, lang))
                console.print(f"[blue]💾 Disimpan:[/blue] {filepath}")

        if saved_files and auto_run:
            console.print("\n[yellow]Mau jalankan kode yang baru dibuat? (y/n):[/yellow] ", end="")
            choice = input().strip().lower()
            if choice == "y":
                for filepath, lang in saved_files:
                    self._execute_file(filepath, lang)

        return saved_files

    def _execute_file(self, filepath: Path, language: str):
        """Jalankan file dan tampilkan output."""
        console.print(f"\n[bold]▶ Menjalankan {filepath.name}...[/bold]")
        try:
            stdout, stderr, code = self._run_code(filepath, language)
            if stdout:
                console.print(Panel(stdout, title="[green]Output[/green]", border_style="green"))
            if stderr:
                console.print(Panel(stderr, title="[red]Error/Warnings[/red]", border_style="red"))
            if code == 0:
                console.print("[green]✓ Berhasil dijalankan[/green]")
            else:
                console.print(f"[red]✗ Exit code: {code}[/red]")
        except subprocess.TimeoutExpired:
            console.print("[red]✗ Timeout (30 detik)[/red]")
        except Exception as e:
            console.print(f"[red]✗ Error: {e}[/red]")

    def save_session(self):
        """Simpan seluruh sesi chat ke JSON."""
        session_file = self.session_dir / "session.json"
        session_data = {
            "timestamp": datetime.now().isoformat(),
            "platform": platform.system(),
            "messages": self.history
        }
        session_file.write_text(json.dumps(session_data, indent=2, ensure_ascii=False))
        console.print(f"[green]📁 Sesi disimpan di: {self.session_dir}[/green]")

    def show_help(self):
        table = Table(title="[bold cyan]ANITA Commands[/bold cyan]", border_style="cyan")
        table.add_column("Command", style="yellow")
        table.add_column("Fungsi", style="white")
        table.add_row("/help", "Tampilkan bantuan ini")
        table.add_row("/save", "Simpan sesi chat")
        table.add_row("/run [file]", "Jalankan file kode terakhir")
        table.add_row("/files", "Lihat semua file yang disimpan")
        table.add_row("/clear", "Hapus histori chat (mulai baru)")
        table.add_row("/lang [bahasa]", "Set bahasa default output kode")
        table.add_row("/exit", "Keluar dari ANITA")
        console.print(table)
