<?php

namespace App\Service;

use Illuminate\Database\Eloquent\Model;

class FcdrrSetting extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'value',
    ];
}
