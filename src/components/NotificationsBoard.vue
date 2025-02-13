<template>
  <div class="main-container-notifications">
    <div class="main-border-notifications">
      <div v-if="!notifications.length" class="empty-notification-board">You have no notifications.</div>
      <notification v-for="notification in notifications"
      :key="notification._id"
                    :noti-type="notification.type"
                    :seen-status="notification.seen"
                    :sender-username="notification.senderUsername"
                    :sender-displayed-name="notification.senderDisplayedName"
                    :receiver="notification.receiver"
                    :action="notification.action"
                    :notification-date="notification.date"
                    @accept="handleAccept(notification)"
                    @decline="handleDecline(notification)"
      ></notification>
    </div>
  </div>
</template>

<script>

import Notification from "./Notification.vue";
import axios from "axios";
import { store } from '../../store'
export default {
  data(){
    return{
      NAME: "NotificationsBoard",
      myUsername: store.state.currentUser.username,
      myDisplayedName: store.state.currentUser.displayedName,
      notifications: []

    }
  },

  components: {
    'notification': Notification,
  },

  methods: {

    async handleAccept(notification) {
      try {
        await axios.post("http://localhost:5000/api/notifications/update-action", {
          notificationId: notification._id,
          action: "accepted",
          senderUsername: notification.senderUsername,
          senderDisplayedName: notification.senderDisplayedName,
          receiver: notification.receiver,
        });

        console.log("Action updated to 'accepted'");

        await axios.post("http://localhost:5000/api/notifications/friend-request-accepted", {
          receiver: notification.senderUsername,
          senderDisplayedName: this.myDisplayedName,
          senderUsername: this.myUsername,
        });

        console.log("Friend request accepted notification sent");

        notification.action = "accepted";

      } catch (error) {
        console.error("Error accepting friend request:", error);
        alert("Failed to accept friend request.");
      }
    },

    async handleDecline(notification) {
      try {
        console.error("Sending data:", {
          notificationId: notification._id,
          action: "declined",
          senderUsername: notification.senderUsername,
          senderDisplayedName: notification.senderDisplayedName,
          receiver: notification.receiver,
        });

        const response = await axios.post(
            "http://localhost:5000/api/notifications/update-action",
            {
              notificationId: notification._id,
              action: "declined",
              senderDisplayedName: notification.senderDisplayedName,
              senderUsername: notification.senderUsername,
              receiver: notification.receiver,
            }
        );

        console.log("Action updated:", response.data);

        notification.action = "declined";
      } catch (error) {
        console.error("Error declining friend request:", error);
        alert("Failed to decline friend request.");
      }
    },

    async markAllNotificationsAsSeen() {
      try {
        console.error("notyfikacje", this.notifications);
        const unseenNotifications = this.notifications.filter(n => !n.seen);
        console.error(unseenNotifications);
        if (unseenNotifications.length > 0) {
          await axios.post(`http://localhost:5000/api/notifications/mark-seen`, {
            notificationIds: unseenNotifications.map(n => n._id),
          });
          this.notifications.forEach(notification => {
            if (!notification.seen) {
              notification.seen = true;
            }
          });
        }
      } catch (err) {
        console.error("Error marking notifications as seen:", err);
      }
    },

    async init(){
       await this.fetchNotifications();
       this.markAllNotificationsAsSeen();
    },


    async fetchNotifications() {
      try {
        const response = await axios.get(
            `http://localhost:5000/api/notifications/${this.myUsername}`
        );
        this.notifications = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch (err) {
        console.error(err);
      }
    }
  },

  mounted(){
    this.myUsername = store.state.currentUser.username;
    this.init();
  }
}
</script>

<style>

.main-container-notifications{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.empty-notification-board{
  text-align: center;
  width: 100%;
  height: inherit;
  font-weight: 600;
  color: rebeccapurple;
  font-family: system-ui;
  align-content: center;
}

.main-border-notifications{
  border-left: 1px solid grey;
  border-right: 1px solid grey;
  width: 30%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  box-shadow: 0 0 10px rebeccapurple;
}



</style>