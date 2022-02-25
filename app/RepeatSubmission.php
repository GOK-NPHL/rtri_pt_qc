<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RepeatSubmission extends Model
{
    protected $fillable = [
        "result_control_line",
        "result_verification_line",
        "result_longterm_line",
        "interpretation",
        "qcsubmissions_id",
        "test_type",
        "submitted"
    ];
}