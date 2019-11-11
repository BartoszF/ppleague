import { request } from '../APIUtils';

const NotificationService = {
    rejectNotification: function(notificationId) {
        return request({
            url: "/notification/"+notificationId+"/reject",
            method: 'GET'
        });
    }

}

export default NotificationService;