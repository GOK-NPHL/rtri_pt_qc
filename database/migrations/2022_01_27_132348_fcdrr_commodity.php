<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FcdrrCommodity extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fcdrr_commodities', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("commodity_name");
            $table->string("unit_of_issue");
            $table->string("manufacturer");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fcdrr_commodities');
    }
}
