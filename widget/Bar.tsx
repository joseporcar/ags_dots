import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { Variable, bind, GLib } from "astal"
import Hyprland from "gi://AstalHyprland"
import Battery from "gi://AstalBattery"

function Workspaces() {
    const hypr = Hyprland.get_default()
    const fw = bind(hypr, "focusedWorkspace")
    return <box cssClasses={["workspaces"]}> 
        {
        bind(hypr, "workspaces").as(workspaces => workspaces
            .filter(ws => ws.id > 0)
            .sort((a,b) => a.id - b.id)
            .map(ws => <button
                css_classes={fw.as(fw => fw === ws ? ["focused"] : ["unfocused"])}
                onClicked={() => ws.focus()}
                label={fw.as(fw => fw === ws ? "|" : "—")}
            />)
        )
        }
    </box>
}

function DateTime() { 
    const datetime = Variable<string>("").poll(5000, () => GLib.DateTime.new_now_local().format("%m-%d  —  %H:%M")!)
    return <label 
        onDestroy={() => datetime.drop()}
        label={datetime()}
    />
}
function Bat() {
    const battery = Battery.get_default()
    return <label
        label={bind(battery, "percentage").as(n => Math.round(n * 100).toString()+"%")}
    />
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
