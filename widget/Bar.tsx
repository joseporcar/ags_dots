import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { Variable, bind } from "astal"
import Hyprland from "gi://AstalHyprland"

const time = Variable("").poll(1000, "date")
const hypr = Hyprland.get_default();
export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    const count = Variable(1);
    function increase() {
        count.set(count.get() * 2)
    }

    function decrease() {
        count.set(count.get() - 1)
    }
    return <window
        visible
        cssClasses={["Bar"]}
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
        application={App}>
        <centerbox cssName="centerbox">

            

            <label label="hellowrold" /> 
            <button label={bind(count).as(x=>x.toString())} onClicked={increase}/>

        </centerbox>
    </window>
}
