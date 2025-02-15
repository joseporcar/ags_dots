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
    return <box>
        <label
        label={bind(battery, "percentage").as(n => Math.round(n * 100).toString()+"%")}
    />
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
                label={item.get_summary()}/>))}
    </box> 
}

function Workspaces() {
    const hypr = Hyprland.get_default()
    const fw = bind(hypr, "focusedWorkspace")
    let wsnotif = bind(hypr.get_workspace_by_name("special:whatsapp")!.lastClient, "title")

    return <box cssClasses={["workspaces"]}> 
        {
        [1, 2, 3, 4, 5]
            .map(ws => <button
                css_classes={fw.as(fw => fw.id === ws ? ["focused"] : ["unfocused"])}
                onClicked={() => hypr.dispatch("focusworkspaceoncurrentmonitor", ws.toString())}
                label={fw.as(fw => fw.id === ws ? "〇" : "○")}
            />)
        }
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
                <Workspaces />
                <Notifications />
            </box>

            <box>
                <DateTime />
                <Audio /> 
            </box>

            <box> 
                <Bat />
            </box>
        </centerbox>
    </window>
}
