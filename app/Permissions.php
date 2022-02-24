<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Permissions extends Model
{
    protected $fillable = [
        "name",
        "slug",
        "is_active",
    ];

    protected $table = "permissions";
    protected $softDelete = true;
}
