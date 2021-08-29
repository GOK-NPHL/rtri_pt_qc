<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QcSubmissionResult extends Model
{

    protected $fillable = [
        "qcsubmission_id",
        "type",
        "control_line",
        "verification_line",
        "longterm_line",
        "interpretation"
    ];
}
