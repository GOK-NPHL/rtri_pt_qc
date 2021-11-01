<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FcdrrSubmissionResults extends Model
{
    protected $fillable = [
        "submission_id",
        "comodity_name",
        "unit_of_issue",
        "beggining_balance",
        "qnty_received_kemsa",
        "qnty_received_other_sources",
        "qnty_used",
        "no_of_tests_done",
        "losses_damages",
        "losses_errors",
        "adjustments_positive",
        "adjustments_negative",
        "end_of_month_stock",
        "days_out_of_stock",
        "qnty_requested_resupply",
        "qnty_expiry_six_months"
    ];
}
