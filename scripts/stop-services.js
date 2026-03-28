import { execSync } from 'child_process';

const PORTS = [5173, 8055];

console.log('--------------------------------------------------');
console.log('   Stopping QingYunZhi Dev Services (Ports: 5173, 8055)');
console.log('--------------------------------------------------');

PORTS.forEach(port => {
  try {
    // 查找监听指定端口的进程 PID
    const output = execSync(`netstat -aon | findstr :${port} | findstr LISTENING`).toString();
    const matches = output.trim().split('\n');
    
    matches.forEach(match => {
      const parts = match.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      
      if (pid && !isNaN(pid) && pid !== '0') {
        console.log(`[FOUND] PID: ${pid} on Port: ${port}. Killing...`);
        try {
          execSync(`taskkill /F /PID ${pid}`);
          console.log(`[SUCCESS] Killed PID: ${pid}`);
        } catch (killErr) {
          console.warn(`[WARN] Failed to kill PID: ${pid} - maybe already closed.`);
        }
      }
    });
  } catch (err) {
    // findstr 返回 1 表示未找到进程，也会导致 execSync 抛异常，此时忽略即可
    console.log(`[CLEAN] Port: ${port} is already free.`);
  }
});

console.log('--------------------------------------------------');
console.log('   Cleanup done! Services are stopped.');
console.log('--------------------------------------------------');
