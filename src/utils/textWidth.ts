
// https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
export default function textWidth(text: string) : number {
    const div = document.createElement("div");
    div.className = "MuiDataGrid-root MuiDataGrid-colCell";
    div.style.whiteSpace = "no-wrap";
    div.style.left = "-1000px";
    div.style.top = "-1000px";
    div.style.visibility = "hidden";
    div.style.position = "absolute";
    div.innerText = "XXXX" + text;
    document.body.appendChild(div);
    const width = div.clientWidth;
    document.body.removeChild(div);
    return width;
}

