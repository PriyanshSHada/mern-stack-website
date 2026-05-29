import subprocess
import sys
import os
import time
import signal

def kill_existing():
    """Kill any existing Node processes to free up ports"""
    try:
        if os.name == 'nt':
            subprocess.run(['taskkill', '/F', '/IM', 'node.exe'], capture_output=True)
        else:
            subprocess.run(['pkill', '-f', 'node'], capture_output=True)
        time.sleep(2)
    except:
        pass

def start_backend():
    print("Starting backend server...")
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    return subprocess.Popen(
        ['node', 'server.js'],
        cwd=backend_dir,
        shell=True if os.name == 'nt' else False
    )

def start_frontend():
    print("Starting frontend server...")
    frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend')
    return subprocess.Popen(
        ['npm', 'run', 'dev'],
        cwd=frontend_dir,
        shell=True if os.name == 'nt' else False
    )

if __name__ == '__main__':
    kill_existing()
    
    backend_process = None
    frontend_process = None
    
    try:
        backend_process = start_backend()
        time.sleep(1)
        frontend_process = start_frontend()
        
        print("\nServers started!")
        print("Backend: http://localhost:5000")
        print("Frontend: http://localhost:5173")
        print("\nPress Ctrl+C to stop both servers\n")
        
        backend_process.wait()
        frontend_process.wait()
        
    except KeyboardInterrupt:
        print("\nStopping servers...")
        if backend_process:
            backend_process.terminate()
        if frontend_process:
            frontend_process.terminate()
        time.sleep(1)
        kill_existing()
        print("Servers stopped.")
        sys.exit(0)
    except Exception as e:
        print(f"\nError: {e}")
        if backend_process:
            backend_process.terminate()
        if frontend_process:
            frontend_process.terminate()
        sys.exit(1)
