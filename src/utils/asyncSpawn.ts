import { spawn as spwn } from 'child_process';

const spawn = (
  cmd: string,
  args: ReadonlyArray<string>,
  options: any,
  setShell: any,
  ) => new Promise((resolve, reject) => {
  const cp = spwn(cmd, args, options);
  const error: string[] = [];
  const stdout: string[] = [];
  cp.stdout?.on('data', (data) => {
    console.log(data.toString());
    stdout.push(data.toString());
  });

  cp.on('spawn', () => {
    setShell(cp);
  })
  // cp.on('error', (e) => {
  //   error.push(e.toString());
  // });

  cp.on('close', () => {
    // if (error.length) reject(error.join(''));
    resolve(stdout.join(''));
  });


    cp.killed
});

export default spawn;