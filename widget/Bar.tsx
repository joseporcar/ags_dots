import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { Variable, bind, GLib } from "astal"
import Hyprland from "gi://AstalHyprland"
import Battery from "gi://AstalBattery"
import Notifd from "gi://AstalNotifd"
import Wp from "gi://AstalWp"

function Audio() {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!;
    let mute = bind(speaker, "mute");

    return <box cssClasses={["volume"]}>
        <button
            onClicked={() => speaker.mute = !speaker.mute}>
            {mute.as(m => m ? "🤫" : "🗣️")}
        </button>
        {/* {bind(speaker, "mute").as(m => m ? <box/> : <slider
            cssClasses={mute.as(m => m ? ["muted"] : ["unmuted"])}
            widthRequest={200}
            value={bind(speaker, "volume").as(v => v * 100)}   
            onScroll={(__,_, y) => speaker.volume = Math.max(speaker.volume + y / 100, 0)}
            //onDragged={({value}) => speaker.volume = value / 100}
            //onChangeValue={val => speaker.volume = val.value / 100}
            onButtonReleased={(slider, _) => speaker.volume = slider.value / 100}            
            //onMotion={(v,x, _) => speaker.volume = x / 100}
            digits={0}
            drawValue={true}
            adjustment={Gtk.Adjustment.new(0, 0, 150, 1, 0, 0)}            
            valuePos={Gtk.PositionType.RIGHT}
        />)} */}
    </box>
}
function Bat() {
    const battery = Battery.get_default()
    const percentage = bind(battery, "percentage")
    let label = <label
        cssClasses={bind(battery, "charging").as(charging => charging ? ["charging"] : ["normal"])}
        label={percentage.as(n => Math.floor(n * 100).toString()+"%")}/>
    percentage.subscribe(n => n < 0.15 && (label.cssClasses = ["lowbat"]))
    return <box cssClasses={["battery"]}>
        {label}
    </box>
}

function Brightness() {
    
}

function DateTime() { 
    const datetime = Variable<string>("").poll(5000, () => GLib.DateTime.new_now_local().format("%m-%d  —  %H:%M")!)
    return <box>
        <label 
        onDestroy={() => datetime.drop()}
        label={datetime()}
    />
    </box>
}

function Notifications() {
    const notifd = Notifd.get_default()

    return <box>
        {bind(notifd, "notifications").as(items => 
            items.map(item => <button 
                onClicked={() => item.dismiss()}
                label={item.get_app_name() + " | " + item.get_summary() + " | " + item.get_body()}/>))}
    </box> 
}

function Workspaces(monitor: Gdk.Monitor) {
    const hypr = Hyprland.get_default()
    const hypr_monitor = hypr.monitors.filter(mon => mon.name == monitor.connector)[0]
    const fw = bind(hypr_monitor, "activeWorkspace")
    let wsnotif = bind(hypr.get_workspace_by_name("special:whatsapp")!.clients[0], "title")

    return <box cssClasses={["workspaces"]}> 
        <box cssClasses={["nonspecial"]}>
            <image file={"assets/vertical_bar.png"} cssClasses={["vertBar"]}/>
            {
            (monitor.connector == "eDP-1" ? [1, 2, 3, 4, 5] : [6, 7, 8, 9, 10])
                .map(ws => <button
                    css_classes={fw.as(fw => fw.id === ws ? ["focused"] : ["unfocused"])}
                    onClicked={() => hypr.dispatch("focusworkspaceoncurrentmonitor", ws.toString())}>
                    <image file={fw.as(fw => fw.id === ws ? "assets/accent_sine.png" : "assets/lavender_sine_wave.png")}/>
                    
                </button>)
            }
            <image file={"assets/vertical_bar.png"} cssClasses={["vertBar"]}/>

        </box>
        <button
            css_classes={wsnotif.as(title => title.charAt(0) == "(" ? ["whatsappNotif"] : ["whatsappNormal"])}
            onClicked={() => hypr.dispatch("togglespecialworkspace", "whatsapp")}>
            {wsnotif.as(title => title.charAt(0) != "(" ? "W" : title.charAt(1))}
            
        </button>
        <button
            css_classes={["specialToggle"]}
            onClicked={() => hypr.dispatch("togglespecialworkspace", "")}>
            S
        </button>
    </box>
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return <window
        visible
        cssClasses={["Bar"]}
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
        application={App}>
        
        <centerbox cssName="centerbox">
            <box>
                {Workspaces(gdkmonitor)}
                <Notifications />
            </box>

            <box>
                <DateTime />
            </box>

            <box> 
                <Audio /> 
                <box cssClasses={["transparent"]} hexpand={true} />
                <Bat />
            </box>
        </centerbox>
    </window>
}
