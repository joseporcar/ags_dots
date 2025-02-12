import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { Variable, bind, GLib } from "astal"
import Hyprland from "gi://AstalHyprland"
import Battery from "gi://AstalBattery"

function Bat() {
    const battery = Battery.get_default()
    return <label
        label={bind(battery, "percentage").as(n => Math.round(n * 100).toString()+"%")}
    />
}

function DateTime() { 
    const datetime = Variable<string>("").poll(5000, () => GLib.DateTime.new_now_local().format("%m-%d  —  %H:%M")!)
    return <label 
        onDestroy={() => datetime.drop()}
        label={datetime()}
    />
}


function Workspaces() {
    const hypr = Hyprland.get_default()
    const fw = bind(hypr, "focusedWorkspace")
    return <box cssClasses={["workspaces"]}> 
        {
        [1, 2, 3, 4, 5]
            .sort((a, b) =>  a - b)
            .map(ws => <button
                css_classes={fw.as(fw => fw.id === ws ? ["focused"] : ["unfocused"])}
                onClicked={() => hypr.dispatch("focusworkspaceoncurrentmonitor", ws.toString())}
                label={fw.as(fw => fw.id === ws ? "〇" : "○")}
            />)
        }
        <button
            css_classes={["whatsappToggle"]}
            onClicked={() => hypr.dispatch("togglespecialworkspace", "whatsapp")}>
            W
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
            </box>

            <box>
                <DateTime />
            </box>

            <box> 
                <Bat />
            </box>
        </centerbox>
    </window>
}
