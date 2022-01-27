<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FcdrrCommodity extends Model
{
    protected $fillable = [
        "commodity_name",
        "unit_of_issue",
        "manufacturer",
    ];

    protected $table = "fcdrr_commodities";
    protected $softDelete = true;
}
