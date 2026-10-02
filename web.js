class Ext {

    getInfo() {

        return {

            id: "hidreaminternet",

            name: "Hidream Internet 2.0",

            color1: "#4169E1",

            color2: "#5F9EA0",

            blocks: [

                {

                    opcode: "whenMinBtnClick",

                    blockType: "hat",

                    text: "当点击绿色缩小按钮"

                },

                {

                    opcode: "createWin",

                    blockType: "command",

                    text: "创建窗口 名称[name] 网址[url]",

                    arguments: {

                        name: { type: "string", defaultValue: "窗口1" },

                        url: { type: "string", defaultValue: "https://www.baidu.com" }

                    }

                },

                {

                    opcode: "createWinByHtml",

                    blockType: "command",

                    text: "通过HTML代码创建窗口 名称[name]",

                    arguments: {

                        name: { type: "string", defaultValue: "HTML窗口" }

                    }

                },

                {

                    opcode: "openCalcWindow",

                    blockType: "command",

                    text: "打开计算器"

                },

                {

                    opcode: "setWinAnimFps",

                    blockType: "command",

                    text: "设置帧率 [fps] 决定动画快慢",

                    arguments: {

                        fps: { type: "number", defaultValue: 60 }

                    }

                },

                {

                    opcode: "setAnimEnabled",

                    blockType: "command",

                    text: "窗口动画 [enabled]",

                    arguments: {

                        enabled: { type: "menu", menu: "animSwitch" }

                    }

                },

                {

                    opcode: "moveWinTo",

                    blockType: "command",

                    text: "窗口[name]移动至 [pos]",

                    arguments: {

                        name: { type: "string", defaultValue: "窗口1" },

                        pos: { type: "menu", menu: "winPos" }

                    }

                },

                {

                    opcode: "closeWin",

                    blockType: "command",

                    text: "关闭窗口[name]",

                    arguments: { name: { type: "string", defaultValue: "窗口1" } }

                },

                {

                    opcode: "refreshPage",

                    blockType: "command",

                    text: "刷新窗口[name]",

                    arguments: { name: { type: "string", defaultValue: "窗口1" } }

                },

                {

                    opcode: "goUrl",

                    blockType: "command",

                    text: "窗口[name]跳转网址[url]",

                    arguments: {

                        name: { type: "string", defaultValue: "窗口1" },

                        url: { type: "string", defaultValue: "" }

                    }

                },

                {

                    opcode: "getCurrentUrl",

                    blockType: "reporter",

                    text: "窗口[name]当前网址",

                    arguments: { name: { type: "string", defaultValue: "窗口1" } }

                },

                {

                    opcode: "setWinBg",

                    blockType: "command",

                    text: "设置窗口[name]背景色[color] 模糊[blur]",

                    arguments: {

                        name: { type: "string", defaultValue: "窗口1" },

                        color: { type: "color", defaultValue: "#121212" },

                        blur: { type: "number", defaultValue: 18 }

                    }

                },

                {

                    opcode: "open2048Game",

                    blockType: "command",

                    text: "打开独立2048小游戏窗口"

                }

            ],

            customUI: { footer: "Hidream原创扩展" },

            menus: {

                winPos: ["中央", "左上", "右上", "顶部", "底部"],

                animSwitch: ["开启", "关闭"]

            }

        };

    }

    constructor() {

        this.winList = {};

        this.drag = null;

        this.resize = null;

        this.topZIndex = 9998;

        this.animFps = 60;

        this.animFrames = 18;

        this.animEnabled = true;

        this.bindMouseEvent();

    }

    whenMinBtnClick() {}

    setWinAnimFps({ fps }) {

        if (fps < 10) fps = 10;

        if (fps > 120) fps = 120;

        this.animFps = fps;

        this.animFrames = Math.max(6, Math.round(18 / (fps / 60)));

    }

    setAnimEnabled({ enabled }) {

        this.animEnabled = (enabled === "开启");

    }

    getAnimDuration() {

        if (!this.animEnabled) return 0;

        return this.animFrames / this.animFps;

    }

    bindMouseEvent() {

        document.addEventListener("mousemove", e => {

            if (this.drag) {

                const { el, ox, oy } = this.drag;

                el.style.left = (e.clientX - ox) + "px";

                el.style.top = (e.clientY - oy) + "px";

            }

            if (this.resize) {

                const { el, w, h, sx, sy } = this.resize;

                let nw = w + (e.clientX - sx);

                let nh = h + (e.clientY - sy);

                if (nw < 280) nw = 280;

                if (nh < 220) nh = 220;

                el.style.width = nw + "px";

                el.style.height = nh + "px";

            }

        });

        document.addEventListener("mouseup", () => {

            this.drag = null;

            this.resize = null;

        });

    }

    bringToFront(boxEl) {

        this.topZIndex += 2;

        boxEl.style.zIndex = this.topZIndex;

    }

    moveWinTo({ name, pos }) {

        const win = this.winList[name];

        if (!win) return;

        const b = win.box;

        const ww = b.offsetWidth;

        const wh = b.offsetHeight;

        const vw = window.innerWidth;

        const vh = window.innerHeight;

        b.style.transition = "none";

        switch (pos) {

            case "中央":

                b.style.left = (vw - ww) / 2 + "px";

                b.style.top = (vh - wh) / 2 + "px";

                break;

            case "左上":

                b.style.left = "20px";

                b.style.top = "20px";

                break;

            case "右上":

                b.style.left = vw - ww - 20 + "px";

                b.style.top = "20px";

                break;

            case "顶部":

                b.style.left = (vw - ww) / 2 + "px";

                b.style.top = "20px";

                break;

            case "底部":

                b.style.left = (vw - ww) / 2 + "px";

                b.style.top = vh - wh - 20 + "px";

                break;

        }

    }

    parseSpecialInput(name, url) {

        const trimmed = url.trim();

        if (trimmed === "2048") {

            this.closeWin({ name });

            this.open2048Game();

            return true;

        }

        if (trimmed === "计算器" || trimmed === "calc" || trimmed === "calculator") {

            this.closeWin({ name });

            this.openCalcWindow();

            return true;

        }

        if (trimmed === "204878") {

            this.closeWin({ name });

            this.open2048CheatGame();

            return true;

        }

        return false;

    }

    createWin({ name, url, isGame = false, isCalc = false, isCheat = false, isHtml = false }) {

        if (this.winList[name]) return;

        const vw = window.innerWidth;

        const vh = window.innerHeight;

        let winW, winH;

        if (isCalc) {

            winW = 260;

            winH = 420;

        } else if (isCheat) {

            winW = 480;

            winH = 660;

        } else if (isGame) {

            winW = 460;

            winH = 560;

        } else {

            winW = 720;

            winH = 520;

        }

        const startX = (vw - winW) / 2;

        const startY = (vh - winH) / 2;

        const dur = this.getAnimDuration();

        const winBox = document.createElement("div");

        winBox.style.cssText = `

            position: fixed;left:${startX}px;top:${startY}px;width:${winW}px;height:${winH}px;

            border-radius:24px;overflow:hidden;background:rgba(18,18,18,0.55);

            backdrop-filter:blur(18px) saturate(110%);-webkit-backdrop-filter:blur(18px) saturate(110%);

            border:1px solid rgba(255,255,255,0.12);transform-origin:center center;

            transform:scale(${this.animEnabled ? 0 : 1});opacity:${this.animEnabled ? 0 : 1};

            transition:transform ${dur}s cubic-bezier(0.2,0,0.2,1),opacity ${dur}s cubic-bezier(0.2,0,0.2,1);

        `;

        this.bringToFront(winBox);

        const titleBar = document.createElement("div");

        titleBar.style.cssText = `height:36px;background:rgba(0,0,0,0.25);display:flex;align-items:center;padding:0 14px;gap:10px;cursor:default;user-select:none;`;

        const btnGroup = document.createElement("div");

        btnGroup.style.display = "flex";

        btnGroup.style.gap = "9px";

        btnGroup.style.webkitAppRegion = "no-drag";

        const closeBtn = document.createElement("div");

        closeBtn.style.cssText = `width:13px;height:13px;border-radius:50%;background:#ff5757;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.12s ease;`;

        closeBtn.onmouseenter = () => {

            closeBtn.style.background = "#d04444";

            closeBtn.innerHTML = `<span style="color:#fff;font-size:10px;line-height:1;display:flex;align-items:center;justify-content:center;">×</span>`;

        };

        closeBtn.onmouseleave = () => {

            closeBtn.style.background = "#ff5757";

            closeBtn.innerHTML = "";

        };

        closeBtn.onclick = () => this.closeWin({ name });

        const zoomMaxBtn = document.createElement("div");

        zoomMaxBtn.style.cssText = `width:13px;height:13px;border-radius:50%;background:#ffc145;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.12s ease;`;

        zoomMaxBtn.onmouseenter = () => {

            zoomMaxBtn.style.background = "#d6a030";

            zoomMaxBtn.innerHTML = `<span style="color:#fff;font-size:10px;line-height:1;display:flex;align-items:center;justify-content:center;">+</span>`;

        };

        zoomMaxBtn.onmouseleave = () => {

            zoomMaxBtn.style.background = "#ffc145";

            zoomMaxBtn.innerHTML = "";

        };

        zoomMaxBtn.onclick = () => {

            const w = this.winList[name];

            if (!w) return;

            w.box.style.transition = `all ${this.getAnimDuration()}s cubic-bezier(0.2,0,0.2,1)`;

            w.box.style.left = "0";

            w.box.style.top = "0";

            w.box.style.width = "100vw";

            w.box.style.height = "100vh";

        };

        const zoomMinBtn = document.createElement("div");

        zoomMinBtn.style.cssText = `width:13px;height:13px;border-radius:50%;background:#39d353;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.12s ease;`;

        zoomMinBtn.onmouseenter = () => {

            zoomMinBtn.style.background = "#28a03e";

            zoomMinBtn.innerHTML = `<span style="color:#fff;font-size:10px;line-height:1;display:flex;align-items:center;justify-content:center;">−</span>`;

        };

        zoomMinBtn.onmouseleave = () => {

            zoomMinBtn.style.background = "#39d353";

            zoomMinBtn.innerHTML = "";

        };

        zoomMinBtn.onclick = () => {

            const w = this.winList[name];

            if (!w) return;

            w.box.style.transition = `all ${this.getAnimDuration()}s cubic-bezier(0.2,0,0.2,1)`;

            this.moveWinTo({ name, pos: "中央" });

            if (isCalc) {

                w.box.style.width = "260px";

                w.box.style.height = "420px";

            } else if (isCheat) {

                w.box.style.width = "480px";

                w.box.style.height = "660px";

            } else if (isGame) {

                w.box.style.width = "460px";

                w.box.style.height = "560px";

            } else {

                w.box.style.width = "720px";

                w.box.style.height = "520px";

            }

            this.whenMinBtnClick();

        };

        btnGroup.append(closeBtn, zoomMaxBtn, zoomMinBtn);

        const winTitle = document.createElement("span");

        winTitle.style.cssText = `flex:1;text-align:center;color:#e8e8e8;font-size:13px;`;

        winTitle.innerText = name;

        titleBar.append(btnGroup, winTitle);

        const toolBar = document.createElement("div");

        toolBar.style.cssText = `height:32px;background:rgba(0,0,0,0.2);display:flex;align-items:center;padding:0 10px;gap:8px;`;

        if (!isGame) toolBar.style.display = "none";

        const refreshBtn = document.createElement("button");

        refreshBtn.innerText = "刷新";

        refreshBtn.style.cssText = `border:none;border-radius:4px;background:#333;color:#fff;padding:2px 10px;font-size:12px;cursor:pointer;`;

        refreshBtn.onclick = () => this.refreshPage({ name });

        const urlInput = document.createElement("input");

        urlInput.style.cssText = `flex:1;height:22px;border:none;border-radius:4px;background:rgba(255,255,255,0.1);color:#fff;padding:0 6px;outline:none;font-size:12px;`;

        urlInput.value = url;

        const goBtn = document.createElement("button");

        goBtn.innerText = "前往";

        goBtn.style.cssText = `border:none;border-radius:4px;background:#333;color:#fff;padding:2px 10px;font-size:12px;cursor:pointer;`;

        goBtn.onclick = () => {

            const inputVal = urlInput.value;

            if (!this.parseSpecialInput(name, inputVal)) {

                this.goUrl({ name, url: inputVal });

            }

        };

        urlInput.addEventListener("keydown", e => {

            if (e.key === "Enter") {

                const inputVal = urlInput.value;

                if (!this.parseSpecialInput(name, inputVal)) {

                    this.goUrl({ name, url: inputVal });

                }

            }

        });

        toolBar.append(refreshBtn, urlInput, goBtn);

        const iframeDom = document.createElement("iframe");

        iframeDom.style.border = "none";

        iframeDom.style.width = "100%";

        iframeDom.style.background = "transparent";

        const setIframeH = () => {

            iframeDom.style.height = toolBar.style.display === "none" ? "calc(100% - 36px)" : "calc(100% - 68px)";

        };

        setIframeH();

        iframeDom.src = url;

        const resizeHandle = document.createElement("div");

        resizeHandle.style.cssText = `position:absolute;right:0;bottom:0;width:22px;height:22px;cursor:nwse-resize;`;

        winBox.append(titleBar, toolBar, iframeDom, resizeHandle);

        document.body.appendChild(winBox);

        this.winList[name] = {

            box: winBox,

            iframe: iframeDom,

            bar: toolBar,

            input: urlInput,

            isGame,

            isCalc,

            isCheat,

            isHtml

        };

        if (this.animEnabled) {

            requestAnimationFrame(() => {

                winBox.style.transform = "scale(1)";

                winBox.style.opacity = "1";

            });

        }

        titleBar.onmousedown = e => {

            e.preventDefault();

            this.bringToFront(winBox);

            winBox.style.transition = "none";

            const r = winBox.getBoundingClientRect();

            this.drag = { el: winBox, ox: e.clientX - r.left, oy: e.clientY - r.top };

        };

        resizeHandle.onmousedown = e => {

            e.preventDefault();

            this.bringToFront(winBox);

            winBox.style.transition = "none";

            this.resize = { el: winBox, w: winBox.offsetWidth, h: winBox.offsetHeight, sx: e.clientX, sy: e.clientY };

        };

    }

    createWinByHtml({ name }) {

        if (this.winList[name]) return;

        this.createWin({ name, url: "", isGame: false, isCalc: false, isCheat: false, isHtml: true });

        const win = this.winList[name];

        if (!win) return;

        const defaultHtml = `

<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8">

<style>

body{margin:0;padding:40px;height:100%;box-sizing:border-box;background:#1a1a1;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:Arial;}

h1{font-size:24px;margin-bottom:12px;}

p{color:#888;font-size:14px;}

</style>

</head>

<body>

<h1>HTML 窗口</h1>

<p>在此加载自定义 HTML 内容</p>

</body>

`;

        win.iframe.src = "data:text/html;charset=utf-8," + encodeURIComponent(defaultHtml);

    }

    openCalcWindow() {

        const calcName = "计算器";

        this.createWin({ name: calcName, url: "", isGame: false, isCalc: true });

        const win = this.winList[calcName];

        if (!win) return;

        const calcHtml = `

<!DOCTYPE html>

<html style="margin:0;padding:0;height:100%;">

<head>

<meta charset="utf-8">

<style>

*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;}

html,body{height:100%;}

body{padding:14px;display:flex;flex-direction:column;background:#000000;color:#ffffff;}

#display{color:#fff;font-size:48px;font-weight:300;text-align:right;padding:10px 6px 18px;overflow:hidden;white-space:nowrap;letter-spacing:-1px;}

.keypad{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;flex:1;}

.btn{border:none;border-radius:50%;width:100%;aspect-ratio:1;font-size:22px;font-weight:400;color:#fff;cursor:pointer;transition:0.1s ease;display:flex;align-items:center;justify-content:center;line-height:1;}

.btn-num{background:#333;}

.btn-num:hover{background:#454545;}

.btn-num:active{background:#555;transform:scale(0.95);}

.btn-op{background:#ff9f0a;font-size:26px;}

.btn-op:hover{background:#ffb340;}

.btn-op:active{background:#ffcc70;transform:scale(0.95);}

.btn-func{background:#a5a5a5;color:#000;}

.btn-func:hover{background:#bababa;}

.btn-func:active{background:#cfcfcf;transform:scale(0.95);}

.wide{grid-column:span 2;aspect-ratio:auto;border-radius:999px;justify-content:flex-start;padding-left:22px;}

</style>

</head>

<body>

<div id="display">0</div>

<div class="keypad">

<button class="btn btn-func" data-val="AC">AC</button>

<button class="btn btn-func" data-val="±">±</button>

<button class="btn btn-func" data-val="%">%</button>

<button class="btn btn-op" data-val="/">÷</button>

<button class="btn btn-num" data-val="7">7</button>

<button class="btn btn-num" data-val="8">8</button>

<button class="btn btn-num" data-val="9">9</button>

<button class="btn btn-op" data-val="*">×</button>

<button class="btn btn-num" data-val="4">4</button>

<button class="btn btn-num" data-val="5">5</button>

<button class="btn btn-num" data-val="6">6</button>

<button class="btn btn-op" data-val="-">−</button>

<button class="btn btn-num" data-val="1">1</button>

<button class="btn btn-num" data-val="2">2</button>

<button class="btn btn-num" data-val="3">3</button>

<button class="btn btn-op" data-val="+">+</button>

<button class="btn wide btn-num" data-val="0">0</button>

<button class="btn btn-num" data-val=".">.</button>

<button class="btn btn-op" data-val="=">=</button>

</div>

<script>

let current = "0", prev = null, op = null, fresh = true;

const disp = document.getElementById("display");

function update(){disp.innerText = current;}

document.querySelectorAll(".btn").forEach(b=>{

    b.onclick = ()=>{

        const v = b.dataset.val;

        if (!isNaN(Number(v)) || v === ".") {

            if (fresh) current = v === "." ? "0." : v, fresh = false;

            else current += v;

        } else if (v === "AC") {current = "0";prev=null;op=null;fresh=true;}

        else if (v === "±") current = String(-Number(current));

        else if (v === "%") current = String(Number(current)/100);

        else if (["+","-","*","/"].includes(v)) {prev = Number(current); op = v; fresh = true;}

        else if (v === "=" && prev !== null) {

            let n = Number(current), res;

            if(op==="+")res=prev+n;

            if(op==="-")res=prev-n;

            if(op==="*")res=prev*n;

            if(op==="/")res=prev/n;

            current = String(res); prev=null;op=null;fresh=true;

        }

        update();

    }

});

update();

</script>

</body>

`;

        win.iframe.src = "data:text/html;charset=utf-8," + encodeURIComponent(calcHtml);

    }

    open2048CheatGame() {

        const gameName = "2048作弊版";

        this.createWin({ name: gameName, url: "", isGame: false, isCheat: true });

        const win = this.winList[gameName];

        if (!win) return;

        win.input.value = "204878";

        const gameHtml = `

<!DOCTYPE html>

<html style="margin:0;padding:0;height:100%;background:#faf8ef;font-family:Arial;">

<head>

<style>

body{display:flex;flex-direction:column;align-items:center;padding:16px;box-sizing:border-box;height:100%;margin:0;}

.info{margin-bottom:8px;font-size:18px;font-weight:bold;color:#776e65;}

.mode-bar{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;justify-content:center;}

.mode-btn{border:none;border-radius:6px;padding:4px 10px;font-size:12px;cursor:pointer;background:#bbada0;color:#fff;transition:0.1s;}

.mode-btn.active{background:#edc22e;transform:scale(1.05);}

.mode-btn:hover{opacity:0.9;}

.num-picker{display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap;justify-content:center;max-width:360px;}

.num-btn{border:none;border-radius:4px;width:40px;height:26px;font-size:12px;font-weight:bold;background:#cdc1b4;color:#776e65;cursor:pointer;}

.num-btn.active{background:#edc22e;color:#fff;transform:scale(1.1);box-shadow:0 2px 6px rgba(237,194,46,0.4);}

.num-btn:hover{opacity:0.85;}

#grid{width:320px;height:320px;background:#bbada0;border-radius:6px;padding:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}

.cell{background:#cdc1b4;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;color:#776e65;cursor:pointer;transition:0.08s;}

.cell:hover{transform:scale(0.95);box-shadow:inset 0 2px 4px rgba(0,0,0,0.1);}

.cell-2{background:#eee4da;}.cell-4{background:#ede0c8;}.cell-8{background:#f2b179;color:white;}

.cell-16{background:#f59563;color:white;}.cell-32{background:#f67c5f;color:white;}.cell-64{background:#f65e3b;color:white;}

.cell-128{background:#edcf72;color:white;font-size:28px;}.cell-256{background:#edcc61;color:white;font-size:28px;}

.cell-512{background:#edc850;color:white;font-size:28px;}.cell-1024{background:#edc53f;color:white;font-size:22px;}

.cell-2048{background:#edc22e;color:white;font-size:22px;}.cell-4096{background:#3c3a32;color:white;font-size:20px;}.cell-8192{background:#2a2825;color:white;font-size:20px;}

.hint{margin-top:8px;color:#888;font-size:12px;text-align:center;}

</style>

</head>

<body>

<div class="info">2048 作弊版</div>

<div class="mode-bar">

<button class="mode-btn" data-mode="place">放置模式</button>

<button class="mode-btn" data-mode="delete">删除模式</button>

<button class="mode-btn" data-mode="clear">清空棋盘</button>

</div>

<div class="num-picker" id="numPicker"></div>

<div id="grid"></div>

<div class="hint" id="hint">点击空格子放置选中的数字 | 方向键仍可移动合并</div>

<script>

let grid = Array(4).fill().map(()=>Array(4).fill(0));

const gridEl = document.getElementById("grid");

const numPickerEl = document.getElementById("numPicker");

const hintEl = document.getElementById("hint");

let currentMode = "place", selectedNum = 2;

const numOptions = [2,4,8,16,32,64,128,256,512,1024,2048,4096,8192];

function renderNum(){numPickerEl.innerHTML="";numOptions.forEach(n=>{

    let b=document.createElement("button");b.className="num-btn"+(n===selectedNum?" active":"");b.innerText=n;

    b.onclick=()=>{selectedNum=n;currentMode="place";renderNum();hintEl.innerText="已选择数字 "+n;};

    numPickerEl.appendChild(b);

})}

function updateMode(){document.querySelectorAll(".mode-btn").forEach(b=>b.classList.toggle("active",b.dataset.mode===currentMode));}

document.querySelectorAll(".mode-btn").forEach(b=>b.onclick=()=>{

    if(b.dataset.mode==="clear"){grid=Array(4).fill().map(()=>Array(4).fill(0));render();hintEl.innerText="棋盘已清空";return;}

    currentMode = b.dataset.mode;updateMode();

    hintEl.innerText=currentMode==="place"?"放置模式：点击空格子放置选中的数字":"删除模式：点击已有数字删除";

});

function render(){gridEl.innerHTML="";for(let y=0;y<4;y++)for(let x=0;x<4;x++){

    let v=grid[y][x],d=document.createElement("div");d.className="cell"+(v?" cell-"+v:"");d.innerText=v||"";

    d.onclick=()=>{if(currentMode==="place")grid[y][x]=selectedNum;else grid[y][x]=0;render();};

    gridEl.appendChild(d);

}}

function randomAdd(){let empty=[];for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(!grid[y][x])empty.push([x,y]);

if(empty.length){const [x,y]=empty[Math.floor(Math.random()*empty.length)];grid[y][x]=Math.random()>0.9?4:2;}}

function init(){grid=Array(4).fill().map(()=>Array(4).fill(0));randomAdd();randomAdd();render();}

function slide(a){let arr=a.filter(v=>v!==0);for(let i=0;i<arr.length-1;i++)if(arr[i]===arr[i+1]){arr[i]*=2;arr[i+1]=0;}

arr=arr.filter(v=>v!==0);while(arr.length<4)arr.push(0);return arr;}

function moveUp(){for(let x=0;x<4;x++){let c=[grid[0][x],grid[1][x],grid[2][x],grid[3][x]];const s=slide(c);for(let y=0;y<4;y++)grid[y][x]=s[y];}}

function moveDown(){for(let x=0;x<4;x++){let c=[grid[3][x],grid[2][x],grid[1][x],grid[0][x]];const s=slide(c).reverse();for(let y=0;y<4;y++)grid[y][x]=s[y];}}

function moveLeft(){for(let y=0;y<4;y++)grid[y]=slide(grid[y]);}

function moveRight(){for(let y=0;y<4;y++)grid[y]=slide(grid[y].slice().reverse()).reverse();}

window.addEventListener("keydown",e=>{

    let old=JSON.stringify(grid);

    if(e.key==="ArrowUp")moveUp();if(e.key==="ArrowDown")moveDown();

    if(e.key==="ArrowLeft")moveLeft();if(e.key==="ArrowRight")moveRight();

    if(JSON.stringify(grid)!==old){randomAdd();render()}

});

renderNum();init();

</script>

</body>

`;

        win.iframe.src = "data:text/html;charset=utf-8," + encodeURIComponent(gameHtml);

    }

    closeWin({ name }) {

        const win = this.winList[name];

        if (!win) return;

        const box = win.box;

        const dur = this.getAnimDuration();

        if (this.animEnabled && dur > 0) {

            box.style.transition = `transform ${dur}s cubic-bezier(0.4,0,1,1),opacity ${dur}s cubic-bezier(0.4,0,1,1)`;

            box.style.transform = "scale(0)";

            box.style.opacity = "0";

            setTimeout(() => { box.remove(); delete this.winList[name]; }, dur * 1000);

        } else {

            box.remove();

            delete this.winList[name];

        }

    }

    refreshPage({ name }) {

        const w = this.winList[name];

        if (w) w.iframe.src = w.iframe.src;

    }

    goUrl({ name, url }) {

        const w = this.winList[name];

        if (w) {

            w.iframe.src = url;

            w.input.value = url;

        }

    }

    getCurrentUrl({ name }) {

        const w = this.winList[name];

        return w?.iframe?.src || "无窗口";

    }

    setWinBg({ name, color, blur }) {

        const w = this.winList[name];

        if (!w) return;

        const r = parseInt(color.slice(1, 3), 16);

        const g = parseInt(color.slice(3, 5), 16);

        const b = parseInt(color.slice(5, 7), 16);

        w.box.style.background = `rgba(${r},${g},${b},0.55)`;

        w.box.style.backdropFilter = `blur(${blur}px) saturate(110%)`;

        w.box.style.webkitBackdropFilter = `blur(${blur}px) saturate(110%)`;

    }

    open2048Game() {

        const gameName = "2048游戏";

        this.createWin({ name: gameName, url: "", isGame: true });

        const win = this.winList[gameName];

        if (!win) return;

        win.input.value = "2048";

        const gameHtml = `

<!DOCTYPE html>

<html style="margin:0;padding:0;height:100%;background:#faf8ef;font-family:Arial;">

<head>

<style>

body{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;height:100%;margin:0;}

.info{margin-bottom:12px;font-size:20px;font-weight:bold;color:#776e65;}

#grid{width:320px;height:320px;background:#bbada0;border-radius:6px;padding:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}

.cell{background:#cdc1b4;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;color:#776e65;}

.cell-2{background:#eee4da;}.cell-4{background:#ede0c8;}.cell-8{background:#f2b179;color:white;}

.cell-16{background:#f59563;color:white;}.cell-32{background:#f67c5f;color:white;}.cell-64{background:#f65e3b;color:white;}

.cell-128{background:#edcf72;color:white;font-size:28px;}.cell-256{background:#edcc61;color:white;font-size:28px;}

.cell-512{background:#edc850;color:white;font-size:28px;}.cell-1024{background:#edc53f;color:white;font-size:22px;}

.cell-2048{background:#edc22e;color:white;font-size:22px;}

</style>

</head>

<body>

<div class="info">2048 本地离线小游戏</div>

<div id="grid"></div>

<script>

let grid = Array(4).fill().map(()=>Array(4).fill(0));

const gridEl = document.getElementById("grid");

function render(){gridEl.innerHTML="";for(let y=0;y<4;y++)for(let x=0;x<4;x++){

    let v=grid[y][x],d=document.createElement("div");d.className="cell"+(v?" cell-"+v:"");d.innerText=v||"";gridEl.appendChild(d);

}}

function randomAdd(){let empty=[];for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(!grid[y][x])empty.push([x,y]);

if(empty.length){const [x,y]=empty[Math.floor(Math.random()*empty.length)];grid[y][x]=Math.random()>0.9?4:2;}}

function init(){grid=Array(4).fill().map(()=>Array(4).fill(0));randomAdd();randomAdd();render();}

function slide(a){let arr=a.filter(v=>v!==0);for(let i=0;i<arr.length-1;i++)if(arr[i]===arr[i+1]){arr[i]*=2;arr[i+1]=0;}

arr=arr.filter(v=>v!==0);while(arr.length<4)arr.push(0);return arr;}

function moveUp(){for(let x=0;x<4;x++){let c=[grid[0][x],grid[1][x],grid[2][x],grid[3][x]];const s=slide(c);for(let y=0;y<4;y++)grid[y][x]=s[y];}}

function moveDown(){for(let x=0;x<4;x++){let c=[grid[3][x],grid[2][x],grid[1][x],grid[0][x]];const s=slide(c).reverse();for(let y=0;y<4;y++)grid[y][x]=s[y];}}

function moveLeft(){for(let y=0;y<4;y++)grid[y]=slide(grid[y]);}

function moveRight(){for(let y=0;y<4;y++)grid[y]=slide(grid[y].slice().reverse()).reverse();}

window.addEventListener("keydown",e=>{

    let old=JSON.stringify(grid);

    if(e.key==="ArrowUp")moveUp();if(e.key==="ArrowDown")moveDown();

    if(e.key==="ArrowLeft")moveLeft();if(e.key==="ArrowRight")moveRight();

    if(JSON.stringify(grid)!==old){randomAdd();render()}

});

init();

</script>

</body>

`;

        win.iframe.src = "data:text/html;charset=utf-8," + encodeURIComponent(gameHtml);

    }

}

Scratch.extensions.register(new Ext());