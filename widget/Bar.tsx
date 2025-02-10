import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { Variable, bind, GLib } from "astal"
import Hyprland from "gi://AstalHyprland"
import AstalHyprland from "gi://AstalHyprland"
import Battery from "gi://AstalBattery"

function Workspaces() {
    const hypr = Hyprland.get_default()

    function workspaceParser(workspaces: AstalHyprland.Workspace[]) {
        return workspaces
            .filter(ws => ws.id > 0)
            .sort((a,b) => a.id - b.id)
            .map(ws => <button
                onClicked={() => ws.focus()}
                label={bind(hypr, "focusedWorkspace").as(a => a === ws ? "|" : "–")}
            />)
    }
    return <box> 
        {
        bind(hypr, "workspaces").as(workspaceParser)
        }
    </box>
}

function DateTime() { 
    const datetime = Variable<string>("").poll(1000, () => GLib.DateTime.new_now_local().format("%H:%M - %m/%e.")!)
    return <label 
        onDestroy={() => datetime.drop()}
        label={datetime()}
    />
}
function Bat() {
    const battery = Battery.get_default()
    return <label
        label={bind(battery, "percentage").as(n => (n * 100).toString())}
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
            <box cssName="lbox">
                <Workspaces />
            </box>

            <box cssName="cbox">
                <DateTime />
            </box>

            <box cssName="rbox"> 
                <Bat />
            </box>
        </centerbox>
    </window>
}
