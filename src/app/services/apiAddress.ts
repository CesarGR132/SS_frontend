import os from 'os';

function getApiAddress() {
    const nets = os.networkInterfaces();
    const results: Record<string, string[]> = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name] ?? []) {
          // Ignora las interfaces internas (loopback)
          if (net.internal === false) {
            results[name] = results[name] || [];
            results[name].push(net.address);
          }
        }
      }

      return results['Wi-Fi'][3];
}