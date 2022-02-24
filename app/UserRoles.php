<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserRoles extends Model
{
    protected $fillable = [
        "name",
        "authorities",
    ];

    protected $table = "user_roles";
    protected $softDelete = true;
}
