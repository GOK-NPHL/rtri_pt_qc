<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FcdrrSubmission extends Model
{
    protected $fillable = [
        "start_month",
        "end_month",
        "lab_id",
        "user_id",
    ];
}
