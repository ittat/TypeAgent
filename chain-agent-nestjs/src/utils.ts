import { MessageContent } from "@langchain/core/messages";

export function convertMessageContentToString(input: MessageContent): string {

    if (typeof input === "string") {
        return input;
    }

    if (Array.isArray(input)) {
       
        input.map((item) => {
            if (item.type === "text") {
                return item.text;
            }else if (item.type === "image_url") {
                return `<img src="${item.image_url}" />`;
            }else {
                return "unknown";
            }
        })
        return input.join("\n");
    } else {
        return "unknown";

    }

}