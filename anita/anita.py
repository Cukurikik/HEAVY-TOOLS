#!/usr/bin/env python3
"""
ANITA - AI Coding Assistant
Jalankan: python3 anita.py
"""

import os
import sys
import argparse
from pathlib import Path

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.text import Text
    from prompt_toolkit import PromptSession
    from prompt_toolkit.history import FileHistory
    from prompt_toolkit.auto_suggest import AutoSuggestFromHistory
    from prompt_toolkit.styles import Style
except ImportError:
    print("Install dependensi dulu:\npip install anthropic rich prompt_toolkit")
    sys.exit(1)

from anita_core import ANITAAssistant

console = Console()

PROMPT_STYLE = Style.from_dict({
    "prompt": "bold #00d7ff",
})

BANNER = """
[bold cyan]
  ╔═══════════════════════════════════════════════════╗
  ║     ⚡  A . N . I . T . A  ⚡                    ║
  ║   Artificial Neural Intelligence &               ║
  ║   Technology Assistant                           ║
  ║                                                  ║
  ║   Semua bahasa · Semua platform · Kode asli      ║
  ╚═══════════════════════════════════════════════════╝
[/bold cyan]
[dim]Ketik /help untuk daftar perintah · /exit untuk keluar[/dim]
"""


def setup_api_key():
    """Setup API key interaktif."""
    console.print(Panel(
        "Masukkan Anthropic API Key kamu.\n"
        "Dapatkan di: [link=https://console.anthropic.com]console.anthropic.com[/link]",
        title="Setup ANITA",
        border_style="cyan"
    ))
    key = input("API Key (sk-ant-...): ").strip()
    if not key.startswith("sk-ant-"):
        console.print("[red]Format API key salah.[/red]")
        return

    # Simpan ke .env
    env_file = Path(".env")
    env_file.write_text(f"ANTHROPIC_API_KEY={key}\n")
    console.print("[green]✓ API key tersimpan di .env[/green]")
    console.print("Jalankan ulang: [yellow]python3 anita.py[/yellow]")


def load_env():
    """Load .env file jika ada."""
    env_file = Path(".env")
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                key, _, val = line.partition("=")
                os.environ.setdefault(key.strip(), val.strip())


def main():
    parser = argparse.ArgumentParser(description="ANITA AI Coding Assistant")
    parser.add_argument("--setup", action="store_true", help="Setup API key")
    parser.add_argument("--key", help="API key langsung dari argumen")
    parser.add_argument("--no-autorun", action="store_true", help="Jangan tanya untuk run kode")
    parser.add_argument("--no-autosave", action="store_true", help="Jangan simpan kode otomatis")
    args = parser.parse_args()

    if args.setup:
        setup_api_key()
        return

    load_env()

    console.print(BANNER)

    # Init ANITA
    try:
        anita = ANITAAssistant(api_key=args.key)
    except SystemExit:
        return

    auto_save = not args.no_autosave
    auto_run = not args.no_autorun

    # Prompt session dengan history
    history_file = Path(".anita_history")
    session = PromptSession(
        history=FileHistory(str(history_file)),
        auto_suggest=AutoSuggestFromHistory(),
        style=PROMPT_STYLE,
    )

    console.print("[green]✓ ANITA siap! Tanya apa saja...[/green]\n")

    while True:
        try:
            user_input = session.prompt("You ▶ ").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[yellow]Ctrl+C — ketik /exit untuk keluar[/yellow]")
            continue

        if not user_input:
            continue

        # ── Perintah internal ──────────────────────────────────────────────
        if user_input.startswith("/"):
            cmd = user_input.lower().split()[0]

            if cmd == "/exit":
                anita.save_session()
                console.print("[cyan]Sampai jumpa! Sesi tersimpan.[/cyan]")
                break

            elif cmd == "/help":
                anita.show_help()

            elif cmd == "/save":
                anita.save_session()

            elif cmd == "/clear":
                anita.history.clear()
                console.print("[green]✓ Histori dihapus. Mulai sesi baru.[/green]")

            elif cmd == "/files":
                files = list(anita.session_dir.iterdir())
                if files:
                    for f in sorted(files):
                        size = f.stat().st_size
                        console.print(f"  [blue]{f.name}[/blue] ({size:,} bytes)")
                else:
                    console.print("[dim]Belum ada file yang disimpan.[/dim]")

            elif cmd == "/run":
                parts = user_input.split(maxsplit=1)
                if len(parts) > 1:
                    target = anita.session_dir / parts[1]
                    if target.exists():
                        # Deteksi bahasa dari ekstensi
                        ext = target.suffix
                        lang = next(
                            (k for k, v in __import__("anita_core").LANGUAGE_MAP.items()
                             if v["ext"] == ext), "text"
                        )
                        anita._execute_file(target, lang)
                    else:
                        console.print(f"[red]File tidak ditemukan: {target}[/red]")
                else:
                    # Jalankan file terakhir
                    files = sorted(anita.session_dir.glob("anita_*"))
                    if files:
                        last = files[-1]
                        ext = last.suffix
                        from anita_core import LANGUAGE_MAP
                        lang = next(
                            (k for k, v in LANGUAGE_MAP.items() if v["ext"] == ext), "text"
                        )
                        anita._execute_file(last, lang)
                    else:
                        console.print("[dim]Belum ada kode yang disimpan.[/dim]")

            else:
                console.print(f"[red]Perintah tidak dikenal: {cmd}[/red]")

            continue

        # ── Chat dengan ANITA ──────────────────────────────────────────────
        try:
            response = anita.chat(user_input, stream=True)
            anita.process_response(response, auto_save=auto_save, auto_run=auto_run)
        except Exception as e:
            console.print(f"[red]Error: {e}[/red]")


if __name__ == "__main__":
    main()
