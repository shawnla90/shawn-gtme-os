#!/usr/bin/env python3
"""Supervisor for detached runs. macOS has no setsid(1); this does os.setsid() itself.

usage: _detach.py --log ABS --pidfile ABS --statusfile ABS [--cwd ABS] [--stdin ABS] [--env K=V]... -- cmd args...

Parent: new session (immune to the launching shell/tool being reaped), forks the job,
writes its pid, waits, writes "exit:<code>" and exits. Child: redirects stdio, execs cmd.
"""
import os, sys, time

def parse(argv):
    o = {"env": []}
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--":
            o["cmd"] = argv[i + 1:]
            break
        if a in ("--log", "--pidfile", "--statusfile", "--cwd", "--stdin"):
            o[a[2:]] = argv[i + 1]; i += 2; continue
        if a == "--env":
            o["env"].append(argv[i + 1]); i += 2; continue
        sys.exit(f"unknown arg {a}")
    for k in ("log", "pidfile", "statusfile"):
        if k not in o or not os.path.isabs(o[k]):
            sys.exit(f"--{k} must be an absolute path")
    if not o.get("cmd"):
        sys.exit("no command after --")
    return o

def main():
    o = parse(sys.argv[1:])
    os.setsid()
    pid = os.fork()
    if pid == 0:
        fd = os.open(o["log"], os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
        os.dup2(fd, 1); os.dup2(fd, 2)
        sfd = os.open(o.get("stdin") or "/dev/null", os.O_RDONLY)
        os.dup2(sfd, 0)
        if o.get("cwd"):
            os.chdir(o["cwd"])
        for kv in o["env"]:
            k, _, v = kv.partition("=")
            os.environ[k] = v
        os.execvp(o["cmd"][0], o["cmd"])
    with open(o["pidfile"], "w") as f:
        f.write(str(pid))
    with open(o["statusfile"], "w") as f:
        f.write("running")
    _, st = os.waitpid(pid, 0)
    code = os.waitstatus_to_exitcode(st) if hasattr(os, "waitstatus_to_exitcode") else (st >> 8)
    with open(o["statusfile"], "w") as f:
        f.write(f"exit:{code}")
    with open(o["log"], "a") as f:
        f.write(f"\n[detach] exited {code} at {time.strftime('%Y-%m-%dT%H:%M:%S%z')}\n")

if __name__ == "__main__":
    main()
