import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { Variable, bind } from "astal"
import Hyprland from "gi://AstalHyprland"
import AstalHyprland from "gi://AstalHyprland"

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
