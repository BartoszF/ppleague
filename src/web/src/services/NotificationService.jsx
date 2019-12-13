import { request } from '../APIUtils';

const NotificationService = {
  rejectNotification(notificationId) {
    return request({
      url: `/notification/${notificationId}/reject`,
      method: 'GET',
    });
  },
  getInvitations() {
    return request({
      url: '/notification/matchInvitation',
      method: 'GET',
    });
  },

};

export default NotificationService;
