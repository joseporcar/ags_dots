import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { Variable, bind } from "astal"
import Hyprland from "gi://AstalHyprland"

function Workspaces() {
    const hypr = Hyprland.get_default()
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
                <label label="hellowrold" /> 
            </box>

            <box>

            </box>

            <box> 
                <label label="arst" /> 
                <label label="p" /> 
            </box>
        </centerbox>
    </window>
}
