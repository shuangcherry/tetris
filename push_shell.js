const execSync = require('child_process').execSync;
// console.log(process.argv)
function execCommand(command){
    return execSync(command).toString();
}

function autoPush(){
    let args = process.argv.slice(2);
    if(args.length === 0){
        console.error('请输入提交备注');
        return;
    }
    try{
        execCommand('git add .');
        execCommand(`git commit -m ${args[0]}`);
        execCommand('git push');
    }catch(err){
        console.log(err);
    }
}

autoPush();