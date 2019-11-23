import { request } from '../APIUtils';

const NotificationService = {
    rejectNotification: function(notificationId) {
        return request({
            url: "/notification/"+notificationId+"/reject",
            method: 'GET'
        });
    },
    getInvitations: function() {
        return request({
            url: "/notification/matchInvitation",
            method: 'GET'
        });
    },

}

export default NotificationService;