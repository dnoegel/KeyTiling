
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Meta = imports.gi.Meta;
const GConf = imports.gi.GConf;
const Lang = imports.lang;

// Config
const HORIZONTAL_TILES = 10;
const APPS_KEY = "/apps/metacity/global_keybindings/";
//~ const V_STEPS_TOP = new Array(3, 2, 1.5);
//~ const V_STEPS_MIDDLE = new Array(3, 1);
const V_STEPS_TOP = new Array(5, 2.5, 1.6666, 1.25);
const V_STEPS_MIDDLE = new Array(5, 1.6666, 1);
// End Config



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
    
    let h_counter = 0;
    let v_counter = 0;
    
    let v_steps = V_STEPS_TOP;
    let vertical_steps = v_steps.length;
    
    mode = mode%(vertical_steps*(HORIZONTAL_TILES-1));
    
    for(let i=0; i<vertical_steps*(HORIZONTAL_TILES-1);i++){
        h_counter += 1;
        
        if(mode == i){
            return [Math.floor(h_counter/HORIZONTAL_TILES*w), Math.floor(h/v_steps[v_counter])];
        }
        
        if(h_counter == (HORIZONTAL_TILES-1)){
            h_counter = 0;
            v_counter += 1;
        }
        
        
        
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

    
    let h_counter = 0;
    let v_counter = 0;
    
    let v_steps = V_STEPS_MIDDLE;
    let vertical_steps = v_steps.length;

    mode = mode%(vertical_steps*(HORIZONTAL_TILES-1));
    
    let v_full = false;
    
    for(let i=0; i<vertical_steps*(HORIZONTAL_TILES-1);i++){
        h_counter += 1;
        
        v_full = (v_steps[v_counter]==1) ? true : false;
        
        if(mode == i){
            return [Math.floor(h_counter/HORIZONTAL_TILES*w), Math.floor(h/v_steps[v_counter]), v_full];
        }
        
        if(h_counter == HORIZONTAL_TILES-1){
            h_counter = 0;
            v_counter += 1;
        }
        
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
    
    let h_counter = 0;
    let v_counter = 0;
    
    let v_steps = V_STEPS_TOP;
    let vertical_steps = v_steps.length;
    let horizontal_steps = Math.floor(HORIZONTAL_TILES/2);
    
    mode = mode%(vertical_steps*horizontal_steps);
    
    let h_full = false;
    
    for(let i=0; i<vertical_steps*horizontal_steps;i++){
        h_counter += 1;
        
        h_full = (h_counter==horizontal_steps) ? true : false;
        
        if(mode == i){
            if(h_full){
                return [Math.floor(w), Math.floor(h/v_steps[v_counter]), h_full];
                
            }else{
                return [Math.floor(h_counter/horizontal_steps*w), Math.floor(h/v_steps[v_counter]), h_full];
            }
        }
        
        if(h_counter == horizontal_steps){
            h_counter = 0;
            v_counter += 1;
        }
        
    }

}

function get_size_middle(mode, window){
    
    if (window.resizeable == false){
        let rect = window.get_rect();
        return [rect.width, rect.height, false];
    }
    
    monitor = Main.layoutManager.focusMonitor;
    let offsetY = (isPrimaryMonitor(monitor)) ? Main.panel.actor.height : 0;
    
    let w = Main.layoutManager.focusMonitor.width;
    let h = Main.layoutManager.focusMonitor.height-offsetY;

    
    let h_counter = 0;
    let v_counter = 0;
    
    let v_steps = V_STEPS_MIDDLE;
    let vertical_steps = v_steps.length;
    let horizontal_steps = Math.floor(HORIZONTAL_TILES/2);
    
    mode = mode%(vertical_steps*horizontal_steps);
    
    let v_full = false;
    
    for(let i=0; i<vertical_steps*horizontal_steps;i++){
        h_counter += 1;
        
        v_full = (v_steps[v_counter]==1) ? true : false;
        
        if(mode == i){
            return [Math.floor(h_counter/horizontal_steps*w), Math.floor(h/v_steps[v_counter]), v_full];
        }
        
        if(h_counter == horizontal_steps){
            h_counter = 0;
            v_counter += 1;
        }
        
    }

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





function showMessage() {
    this._init();
}

showMessage.prototype = {
    _init:function(){
        this.text = new St.Label({ style_class: 'helloworld-label', text: "" });
        
    
    },
    
    show:function(content){
        this.text.set_text(content);

        Main.uiGroup.add_actor(this.text);
        this.text.opacity = 255;

        let monitor = Main.layoutManager.primaryMonitor;
    
        this.text.set_position(Math.floor(monitor.width / 2 - this.text.width / 2),
                          Math.floor(monitor.height / 2 - this.text.height / 2));
    
        Tweener.addTween(this.text,
                         { opacity: 0,
                           time: 2,
                           transition: 'easeOutQuad',
                           onComplete: this.hideMessage });
    },
    
    hideMessage:function () {
        Main.uiGroup.remove_actor(this.text);
     }
};

function KeyTiling(){
    this._init();
}

KeyTiling.prototype = {
    _init:function(){
        this.Message = new showMessage();
        this.managed_windows = new Array();
    },
    
    find_managed_window:function(win){
        for ( let i = 0; i < this.managed_windows.length; ++i ) {
            if (this.managed_windows[i][0] == win){
                return win;
            }
        }
        return false;
    },

    next_monitor:function() {
        let win = getFocusApp();
        let next = get_next_monitor();
        
        if (win) {
            w = this.find_managed_window(win);
            if (w){
                let pos = w[2];
                win.move_frame(true, next.x, next.y);
                move_window(pos);
            }else{
                win.move_frame(true, next.x, next.y);
            }
            
        }
    },

    move_window: function(pos) {
        global.log("Tiling: "+pos);
        let found = false;
        let elem = -1;
        let c;
        let rect;
        let old_pos = false;
        
        win = getFocusApp();
            
        for ( let i = 0; i < this.managed_windows.length; ++i ) {
            if (this.managed_windows[i][0] == win) {
                global.log("found existing window");
                old_pos = this.managed_windows[i][2];
                let rect = this.managed_windows[i][1];
                
                if (old_pos == pos){
                    global.log("old position");
                    c = this.managed_windows[i][3]+1;
                }else{
                    global.log("new position");
                    c = 0;
                }
                this.managed_windows[i] = new Array(win, rect, pos, c);
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
            elem = this.managed_windows.push(new Array(win, win.get_outer_rect(), pos, 0));
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
        
        let mode = this.managed_windows[elem][3];
        global.log("Mode: "+mode);
        global.log("Position: "+pos);
        
        monitor_offset_x = Main.layoutManager.focusMonitor.x;
        monitor_offset_y = Main.layoutManager.focusMonitor.y;
        
        
        let y;
        switch(pos){
            case "f":
                if (old_pos == "f"){
                    win.unmaximize(Meta.MaximizeFlags.HORIZONTAL | Meta.MaximizeFlags.VERTICAL);
                    this.managed_windows.splice(elem);
                }else{
                    win.maximize(Meta.MaximizeFlags.HORIZONTAL | Meta.MaximizeFlags.VERTICAL);
                }
                break;
            case "lt":
                this.Message.show("top left");
                [w, h] = get_cornersize(mode, win);
                win.resize(true,w-vBorderX,h-vBorderY);
                //~ win.move_frame(true,w-borderX,h+offsetY-borderY);
                win.move_frame(true, monitor_offset_x-borderX, monitor_offset_y+offsetY-borderY);
                break;
            case "rt":
                this.Message.show("top right");
                [w, h] = get_cornersize(mode, win);
                win.resize(true,w-vBorderX,h-vBorderY);
                //~ win.move_frame(true,w-borderX,h+offsetY-borderY);
                win.move_frame(true, monitor_offset_x+mon_w-borderX-w, monitor_offset_y+offsetY-borderY);
                break;
            case "l":
                this.Message.show("left");
                [w, h, full] = get_sidesize_lr(mode, win);
                if (full ==true){
                    y = offsetY-borderY;
                }else{
                    y = (mon_h-h)/2+offsetY-borderY;
                }
                //~ win.move_frame(true, 0-borderX, y+offsetY-borderY);
                win.resize(true,w-vBorderX,h-vBorderY);
                win.move_frame(true, monitor_offset_x-borderX, monitor_offset_y+y);
                break;
            case "r":
                this.Message.show("right");
                [w, h, full] = get_sidesize_lr(mode, win);
                if (full ==true){
                    y = offsetY-borderY;
                }else{
                    y = (mon_h-h)/2+offsetY-borderY;
                }
                //~ win.move_frame(true, 0-borderX, y+offsetY-borderY);
                win.resize(true,w-vBorderX,h-vBorderY);
                win.move_frame(true, monitor_offset_x+mon_w-borderX-w, monitor_offset_y+y);
                break;
            case "lb":
                this.Message.show("bottom left");
                [w, h] = get_cornersize(mode, win);
                win.resize(true,w-vBorderX,h-vBorderY);
                //~ win.move_frame(true,w-borderX,h+offsetY-borderY);
                win.move_frame(true, monitor_offset_x-borderX, monitor_offset_y+mon_h-h+offsetY-borderY);
                break;
            case "rb":
                this.Message.show("bottom right");
                [w, h] = get_cornersize(mode, win);
                win.resize(true,w-vBorderX,h-vBorderY);
                //~ win.move_frame(true,w-borderX,h+offsetY-borderY);
                win.move_frame(true, monitor_offset_x+mon_w-borderX-w, monitor_offset_y+mon_h-h+offsetY-borderY);
                break;
            case "i":
                this.Message.show("initial position");
                let coords = this.managed_windows[elem][1];
                win.resize(true,coords.width-vBorderX,coords.height-vBorderY);
                win.move_frame(true, coords.x-borderX, coords.y-borderY);
                break;
            case "c":
                this.Message.show("center");
                [w, h, full] = get_size_middle(mode, win);
                if (full == true){
                    y = offsetY-borderY;
                }else{
                    y = (mon_h-h)/2+offsetY-borderY;
                }
                //~ win.move_frame(true, 0-borderX, y+offsetY-borderY);
                win.resize(true,w-vBorderX,h-vBorderY);
                win.move_frame(true, monitor_offset_x+(mon_w-w)/2-borderX, monitor_offset_y+y);
                break;
            case "t":
                this.Message.show("top");
                [w, h, full] = get_sidesize_tb(mode, win);
                if (full == true){
                    x = 0-borderX;
                }else{
                    x = (mon_w-w)/2-borderX;//w-borderX;
                }
                //~ win.move_frame(true, 0-borderX, y+offsetY-borderY);
                win.resize(true,w-vBorderX,h-vBorderY);
                win.move_frame(true, monitor_offset_x+x, monitor_offset_y-borderY+offsetY);
                break;
            case "b":
                this.Message.show("bottom");
                [w, h, full] = get_sidesize_tb(mode, win);
                if (full == true){
                    x = 0-borderX;
                }else{
                    x = (mon_w-w)/2-borderX;//w-borderX;
                }
                //~ win.move_frame(true, 0-borderX, y+offsetY-borderY);
                win.resize(true,w-vBorderX,h-vBorderY);
                win.move_frame(true, monitor_offset_x+x, monitor_offset_y+mon_h-h+offsetY-borderY);
                break;
        }
    },
    
    handle: function(name, func) {
        Main.wm.setKeybindingHandler('run_command_' + name, func);
    },
    
    _init_keybindings: function() {
        this.handle('7',  Lang.bind(this, function(){this.move_window("lt");}));
        this.handle('4',  Lang.bind(this, function(){this.move_window("l");}));
        this.handle('1',  Lang.bind(this, function(){this.move_window("lb");}));
        this.handle('5',  Lang.bind(this, function(){this.move_window("c");}));
        this.handle('9',  Lang.bind(this, function(){this.move_window("rt");}));
        this.handle('6',  Lang.bind(this, function(){this.move_window("r");}));
        this.handle('3',  Lang.bind(this, function(){this.move_window("rb");}));
        this.handle('8',  Lang.bind(this, function(){this.move_window("t");}));
        this.handle('2',  Lang.bind(this, function(){this.move_window("b");}));
        this.handle('10',  Lang.bind(this, function(){this.next_monitor();}));
        this.handle('11',  Lang.bind(this, function(){this.move_window("i");}));
    },
    


    enable: function() {
        this._init_keybindings();
        
        let n;
        let keys = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, "Enter", 0 );
        client = GConf.Client.get_default();
        for(let i=0; i<keys.length;i++){
            n = i+1;
            client.set_string(APPS_KEY+"run_command_"+n, "<Control><Alt>KP_"+keys[i] );
        }
        
    },

    disable: function() {
        let n;
        let keys = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, "Enter", 0 );
        client = GConf.Client.get_default();
        for(let i=0; i<keys.length;i++){
            n = i+1;
            client.set_string(APPS_KEY+"run_command_"+n, "disabled" );
        }
        
    },

};

function init() {
    let tiling = new KeyTiling();
    return tiling;
}
function main() {
    init().enable();
};

