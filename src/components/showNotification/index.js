
import { notification } from 'antd';
export function showNotification(message, description, type) {

    notification.open({
        message,

        description,

        type,

        placement: "bottomLeft",

        duration: 7,

    });

}

