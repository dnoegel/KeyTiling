
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Meta = imports.gi.Meta;
const GConf = imports.gi.GConf;

const APPS_KEY = "/apps/metacity/global_keybindings/";

let text;
let managed_windows = new Array();

function showMessage(content) {
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: content });
        
    }else{
        text.set_text(content);
    }
    Main.uiGroup.add_actor(text);
    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
                      Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: hideMessage });
}

function hideMessage() {
    Main.uiGroup.remove_actor(text);
    //~ text = null;
 }

//~ Get focused window
function getFocusApp()
{ 
    let windows = global.screen.get_active_workspace().list_windows();
    for ( let i = 0; i < windows.length; ++i ) 
    {
            let metaWindow = windows[i];
            if(metaWindow.has_focus())
            {
                return metaWindow;
            }
    }
    return false;
}

//~ Found here:
//~ https://github.com/vibou/vibou.gTile/blob/master/extension.js
function _getInvisibleBorderPadding(metaWindow) {
    let outerRect = metaWindow.get_outer_rect();
    let inputRect = metaWindow.get_input_rect();
    let [borderX, borderY] = [outerRect.x - inputRect.x,
                              outerRect.y - inputRect.y];

    return [borderX, borderY];
};

//~ Found here:
//~ https://github.com/vibou/vibou.gTile/blob/master/extension.js
function _getVisibleBorderPadding(metaWindow) {
    let clientRect = metaWindow.get_rect();
    let outerRect = metaWindow.get_outer_rect();

    let borderX = outerRect.width - clientRect.width
    let borderY = outerRect.height - clientRect.height;

    return [borderX, borderY];
};

function isPrimaryMonitor(monitor)
{
    return Main.layoutManager.primaryMonitor == monitor;
}

function get_cornersize(mode, window){
    
    if (window.resizeable == false){
        let rect = window.get_rect();
        return [rect.width, rect.height, false];
    }
    
    monitor = Main.layoutManager.focusMonitor;
    let offsetY = (isPrimaryMonitor(monitor)) ? Main.panel.actor.height : 0;
    
    let w = Main.layoutManager.focusMonitor.width;
    let h = Main.layoutManager.focusMonitor.height - offsetY;
    
    switch(mode){
        case 0:
            return [Math.floor(w/3), Math.floor(h/3)];
        case 1:
            return [Math.floor(w/2), Math.floor(h/3)];
        case 2:
            return [Math.floor(w/1.5), Math.floor(h/3)];
        case 3:
            return [Math.floor(w/3), Math.floor(h/2)];
        case 4:
            return [Math.floor(w/2), Math.floor(h/2)];
        case 5:
            return [Math.floor(w/1.5), Math.floor(h/2)];
        case 6:
            return [Math.floor(w/3), Math.floor(h/1.5)];
        case 7:
            return [Math.floor(w/2), Math.floor(h/1.5)];
        case 8:
            return [Math.floor(w/1.5), Math.floor(h/1.5)];
    }
}

function get_sidesize_lr(mode, window){
    
    if (window.resizeable == false){
        let rect = window.get_rect();
        return [rect.width, rect.height, false];
    }
    
    monitor = Main.layoutManager.focusMonitor;
    let offsetY = (isPrimaryMonitor(monitor)) ? Main.panel.actor.height : 0;
    
    let w = Main.layoutManager.focusMonitor.width;
    let h = Main.layoutManager.focusMonitor.height-offsetY;
    
    switch(mode){
        case 0:
            return [Math.floor(w/3), Math.floor(h/3), false];
        case 1:
            return [Math.floor(w/2), Math.floor(h/3), false];
        case 2:
            return [Math.floor(w/1.5), Math.floor(h/3), false];
        case 3:
            return [Math.floor(w/3), h, true];
        case 4:
            return [Math.floor(w/2), h, true];
        case 5:
            return [Math.floor(w/1.5), h, true];
    }
}

function get_sidesize_tb(mode, window){
    
    if (window.resizeable == false){
        let rect = window.get_rect();
        return [rect.width, rect.height, false];
    }
    
    monitor = Main.layoutManager.focusMonitor;
    let offsetY = (isPrimaryMonitor(monitor)) ? Main.panel.actor.height : 0;
    
    let w = Main.layoutManager.focusMonitor.width;
    let h = Main.layoutManager.focusMonitor.height-offsetY;
    
    switch(mode){
        case 0:
            return [Math.floor(w/3), Math.floor(h/3), false];
        case 1:
            return [Math.floor(w/3), Math.floor(h/2), false];
        case 2:
            return [Math.floor(w/3), Math.floor(h/1.5), false];
        case 3:
            return [w, Math.floor(h/3), true];
        case 4:
            return [w, Math.floor(h/2), true];
        case 5:
            return [w, Math.floor(h/1.5), true];
    }
}

function find_managed_window(win){
    for ( let i = 0; i < managed_windows.length; ++i ) {
        if (managed_windows[i][0] == win){
            return win;
        }
    }
    return false;
}

function get_next_monitor(){
    let current = Main.layoutManager.focusMonitor;
    let monitors = Main.layoutManager.monitors;
    
    let next = false;
    for(let i=0;i<monitors.length;i++){
        if (next){
            return monitors[i];
        }
        if (monitors[i] === current){
            next = true;
        }
    }
    
    return Main.layoutManager.primaryMonitor; 
}

//~ function fullscreen() {
    //~ let win = getFocusApp();
    //~ if (win){
        //~ win.maximize(Meta.MaximizeFlags.HORIZONTAL | Meta.MaximizeFlags.VERTICAL);
    //~ }
//~ }

function next_monitor() {
    let win = getFocusApp();
    let next = get_next_monitor();
    
    if (win) {
        w = find_managed_window(win);
        if (w){
            let pos = w[2];
            win.move_frame(true, next.x, next.y);
            move_window(pos);
        }else{
            win.move_frame(true, next.x, next.y);
        }
        
    }
}

move_window = function(pos) {
    global.log("Tiling: "+pos);
    let found = false;
    let elem = -1;
    let c;
    let rect;
    let old_pos = false;
    
    win = getFocusApp();
        
    for ( let i = 0; i < managed_windows.length; ++i ) {
        if (managed_windows[i][0] == win) {
            global.log("found existing window");
            old_pos = managed_windows[i][2];
            let rect = managed_windows[i][1];
            
            if (old_pos == pos){
                global.log("old position");
                c = managed_windows[i][3]+1;
            }else{
                global.log("new position");
                c = 0;
            }
            managed_windows[i] = new Array(win, rect, pos, c);
            global.log("done array");
            found = true;
            elem = i;
            break;
        }
    }
    
    if ( found == true ){
        //~ global.log();
    }else{
        global.log("Adding window");
        elem = managed_windows.push(new Array(win, win.get_outer_rect(), pos, 0));
        rect = win.get_rect();
        elem = elem-1;
    }
    

    monitor = Main.layoutManager.focusMonitor;
    let offsetY = (isPrimaryMonitor(monitor)) ? Main.panel.actor.height : 0;
    let mon_w = Main.layoutManager.focusMonitor.width;
    let mon_h = Main.layoutManager.focusMonitor.height - offsetY;
    
    [borderX,borderY] = _getInvisibleBorderPadding(win);
    [vBorderX,vBorderY] = _getVisibleBorderPadding(win);
    win.unmaximize(Meta.MaximizeFlags.HORIZONTAL | Meta.MaximizeFlags.VERTICAL);
    
    let mode = managed_windows[elem][3];
    global.log("Mode: "+mode);
    global.log("Position: "+pos);
    
    monitor_offset_x = Main.layoutManager.focusMonitor.x;
    monitor_offset_y = Main.layoutManager.focusMonitor.y;
    
    
    let y;
    switch(pos){
        case "f":
            if (old_pos == "f"){
                win.unmaximize(Meta.MaximizeFlags.HORIZONTAL | Meta.MaximizeFlags.VERTICAL);
                managed_windows.splice(elem);
            }else{
                win.maximize(Meta.MaximizeFlags.HORIZONTAL | Meta.MaximizeFlags.VERTICAL);
            }
            break;
        case "lt":
            showMessage("top left");
            [w, h] = get_cornersize(mode%9, win);
            win.resize(true,w-vBorderX,h-vBorderY);
            //~ win.move_frame(true,w-borderX,h+offsetY-borderY);
            win.move_frame(true, monitor_offset_x-borderX, monitor_offset_y+offsetY-borderY);
            break;
        case "rt":
            showMessage("top right");
            [w, h] = get_cornersize(mode%9, win);
            win.resize(true,w-vBorderX,h-vBorderY);
            //~ win.move_frame(true,w-borderX,h+offsetY-borderY);
            win.move_frame(true, monitor_offset_x+mon_w-borderX-w, monitor_offset_y+offsetY-borderY);
            break;
        case "l":
            showMessage("left");
            [w, h, full] = get_sidesize_lr(mode%6, win);
            if (full ==true){
                y = offsetY-borderY;
            }else{
                y = h+offsetY-borderY;
            }
            //~ win.move_frame(true, 0-borderX, y+offsetY-borderY);
            win.resize(true,w-vBorderX,h-vBorderY);
            win.move_frame(true, monitor_offset_x-borderX, monitor_offset_y+y);
            break;
        case "r":
            showMessage("right");
            [w, h, full] = get_sidesize_lr(mode%6, win);
            if (full ==true){
                y = offsetY-borderY;
            }else{
                y = h+offsetY-borderY;
            }
            //~ win.move_frame(true, 0-borderX, y+offsetY-borderY);
            win.resize(true,w-vBorderX,h-vBorderY);
            win.move_frame(true, monitor_offset_x+mon_w-borderX-w, monitor_offset_y+y);
            break;
        case "lb":
            showMessage("bottom left");
            [w, h] = get_cornersize(mode%9, win);
            win.resize(true,w-vBorderX,h-vBorderY);
            //~ win.move_frame(true,w-borderX,h+offsetY-borderY);
            win.move_frame(true, monitor_offset_x-borderX, monitor_offset_y+mon_h-h+offsetY-borderY);
            break;
        case "rb":
            showMessage("bottom right");
            [w, h] = get_cornersize(mode%9, win);
            win.resize(true,w-vBorderX,h-vBorderY);
            //~ win.move_frame(true,w-borderX,h+offsetY-borderY);
            win.move_frame(true, monitor_offset_x+mon_w-borderX-w, monitor_offset_y+mon_h-h+offsetY-borderY);
            break;
        case "c":
            showMessage("initial position");
            let coords = managed_windows[elem][1];
            win.resize(true,coords.width-vBorderX,coords.height-vBorderY);
            win.move_frame(true, coords.x-borderX, coords.y-borderY);
            break;
        case "t":
            showMessage("top");
            [w, h, full] = get_sidesize_tb(mode%6, win);
            if (full == true){
                x = 0-borderX;
            }else{
                x = w-borderX;
            }
            //~ win.move_frame(true, 0-borderX, y+offsetY-borderY);
            win.resize(true,w-vBorderX,h-vBorderY);
            win.move_frame(true, monitor_offset_x+x, monitor_offset_y-borderY+offsetY);
            break;
        case "b":
            showMessage("bottom");
            [w, h, full] = get_sidesize_tb(mode%6, win);
            if (full == true){
                x = 0-borderX;
            }else{
                x = w-borderX;
            }
            //~ win.move_frame(true, 0-borderX, y+offsetY-borderY);
            win.resize(true,w-vBorderX,h-vBorderY);
            win.move_frame(true, monitor_offset_x+x, monitor_offset_y+mon_h-h+offsetY-borderY);
            break;
    }
};

const Tiling = function Tiling() {
    
    this.handle = function(name, func) {
        Main.wm.setKeybindingHandler('run_command_' + name, func);
    }
    
    this._init_keybindings = function() {
        this.handle('7',  function(){move_window("lt");});
        this.handle('4',  function(){move_window("l");});
        this.handle('1',  function(){move_window("lb");});
        this.handle('5',  function(){move_window("c");});
        this.handle('9',  function(){move_window("rt");});
        this.handle('6',  function(){move_window("r");});
        this.handle('3',  function(){move_window("rb");});
        this.handle('8',  function(){move_window("t");});
        this.handle('2',  function(){move_window("b");});
        this.handle('10',  function(){next_monitor();});
        this.handle('11',  function(){move_window("f");});
    };
    


    this.enable = function() {
        this._init_keybindings();
        
        let n;
        let keys = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, "Enter", 0 );
        client = GConf.Client.get_default();
        for(let i=0; i<keys.length;i++){
            n = i+1;
            client.set_string(APPS_KEY+"run_command_"+n, "<Control><Alt>KP_"+keys[i] );
        }
        
    };

    this.disable = function() {
    };

};

function init() {
    let tiling = new Tiling();
    return tiling
}
function main() {
    init().enable();
};

