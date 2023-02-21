document.getElementById('memory-download').addEventListener('click', downloadMemory);

document.getElementById('register-download').addEventListener('click', downloadRegisters);

document.getElementById('code-download').addEventListener('click', downloadCode);

document.getElementById('all-download').addEventListener('click', downloadAll);

function decimalToHexString(number){
    if (number < 0)
    {
        number = 0xFFFFFFFF + number + 1;
    }
    return number.toString(16).toLowerCase();
}

function pad(hex, l){
    while(hex.length < l){
        hex = '0' + hex;
    }
    return hex;
}

function downloadAllMemory() {

    /** @type {Memory} */
    var memory = globalP.getMemory();
    var zero = 0;
    var byte = [0,0,0,0];
    var fileArr = [];
    var item = 0;
    for (var i = 0; i < Math.pow(2,20); i++) {
        var mem = memory.getMem(i);
        if (mem != 0) {
            byte[i % 4] = mem;
        }
        if (i % 4 == 3) {
            if (byte.every(function(ele){return ele == 0})) {
                zero += 1;
            }
            else {
                if (zero == 0) {
                    var string = sprintf("%02x%02x%02x%02x", byte[3],byte[2],byte[1],byte[0]);
                    string = string.replace(/^0+/, '');
                    fileArr.push(string);
                }
                else {
                    if (zero <= 3) {
                        for (var z = 0; z  < zero; z++) {
                            fileArr.push("0");
                        }
                    }
                    else {
                        fileArr.push(sprintf("%s*0", zero));
                    }
                    var string = sprintf("%02x%02x%02x%02x", byte[3],byte[2],byte[1],byte[0]);
                    string = string.replace(/^0+/, '');
                    fileArr.push(string);
                }
                zero = 0;
            }
            byte = [0,0,0,0];
        }
    }
    var fileString = "";
    fileString += "Address        Data\n";
    for (var i = 0; i < fileArr.length; i++) {
        // special condition endwith 0 0 0
        if (i == fileArr.length - 1 && fileArr[i].endsWith("*0")) {
            break;
        }
        fileString += "0x" + pad(decimalToHexString(i*4), 8);
        fileString += "     0x" + pad(fileArr[i], 8);
        fileString += "\n";
        if (i % 8 == 7) {
            fileString += "\n";
        }
    }
    return fileString.trim();
}

function downloadAllRegisters(){
    var regs = globalP.getRegisters();

    var results = "";
    results += "Register        Data\n";
    for (var i = 0; i < regs.length; i++) {
        switch (i){
            case 0:  results += "x0  (zero)     "; break;
            case 1:  results += "x1  (ra)       "; break;
            case 2:  results += "x2  (sp)       "; break;
            case 3:  results += "x3  (gp)       "; break;
            case 4:  results += "x4  (tp)       "; break;
            case 5:  results += "x5  (t0)       "; break;
            case 6:  results += "x6  (t1)       "; break;
            case 7:  results += "x7  (t2)       "; break;
            case 8:  results += "x8  (s0/fp)    "; break;
            case 9:  results += "x9  (s1)       "; break;
            case 10: results += "x10 (a0)       "; break;
            case 11: results += "x11 (a1)       "; break;
            case 12: results += "x12 (a2)       "; break;
            case 13: results += "x13 (a3)       "; break;
            case 14: results += "x14 (a4)       "; break;
            case 15: results += "x15 (a5)       "; break;
            case 16: results += "x16 (a6)       "; break;
            case 17: results += "x17 (a7)       "; break;
            case 18: results += "x18 (s2)       "; break;
            case 19: results += "x19 (s3)       "; break;
            case 20: results += "x20 (s4)       "; break;
            case 21: results += "x21 (s5)       "; break;
            case 22: results += "x22 (s6)       "; break;
            case 23: results += "x23 (s7)       "; break;
            case 24: results += "x24 (s8)       "; break;
            case 25: results += "x25 (s9)       "; break;
            case 26: results += "x26 (s10)      "; break;
            case 27: results += "x27 (s11)      "; break;
            case 28: results += "x28 (t3)       "; break;
            case 29: results += "x29 (t4)       "; break;
            case 30: results += "x30 (t5)       "; break;
            case 31: results += "x31 (t6)       "; break;
        }
        results += "0x" + pad(decimalToHexString(regs[i]), 8) + "\n";
    }
    return results.trim();
}

function downloadAllCode(){
    var regs = globalP.getRegisters();
    var results = document.getElementById('code');
    return results.value;
}

function downloadAll() {
    var parts = [];
    parts.push("# RISC-V Program\n\n");
    parts.push("## Code\n");
    parts.push("```asm\n");
    parts.push(downloadAllCode());
    parts.push("\n```\n\n");
    parts.push("## Registers\n");
    parts.push("```\n");
    parts.push(downloadAllRegisters());
    parts.push("\n```\n\n");
    parts.push("## Memory\n");
    parts.push("```\n");
    parts.push(downloadAllMemory());
    parts.push("\n```");
    var blob = new Blob(parts, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "riscv_prj.md");
}

function downloadCode() {
    var blob = new Blob([downloadAllCode()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "riscv-code.asm");
}

function downloadMemory() {
    var parts = [];
    parts.push("# Memory\n\n");
    parts.push("```\n");
    parts.push(downloadAllMemory());
    parts.push("\n```");
    var blob = new Blob(parts, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "riscv-memory.md");
}

function downloadRegisters(){
    var parts = [];
    parts.push("# Registers\n\n");
    parts.push("```\n");
    parts.push(downloadAllRegisters());
    parts.push("\n```");
    var blob = new Blob(parts, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "riscv-registers.md");
}