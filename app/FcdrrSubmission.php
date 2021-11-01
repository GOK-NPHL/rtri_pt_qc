<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FcdrrSubmission extends Model
{
    protected $fillable = [
        "report_date",
        "lab_id",
        "user_id",
    ];
}
