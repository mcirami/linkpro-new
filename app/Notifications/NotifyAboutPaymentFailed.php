<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyAboutPaymentFailed extends Notification implements ShouldQueue
{
    use Queueable;

    private $userData;

    /**
     * @param array $userData Expects: plan, userID, suspended (bool)
     */
    public function __construct($userData)
    {
        $this->userData = $userData;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $subject = ($this->userData['suspended'] ?? false)
            ? 'Your Plan Has Been Paused'
            : 'There Was a Problem With Your Payment';

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.payment-failed', ['data' => $this->userData]);
    }

    public function toArray($notifiable)
    {
        return [];
    }
}
