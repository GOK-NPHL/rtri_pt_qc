<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->date("testing_date");
            $table->date("kit_date_received");
            $table->date("lot_date_received");
            $table->date("kit_expiry_date");
            $table->integer("kit_lot_no");

            $table->integer("result_lt_control_line");
            $table->integer("result_lt_verification_line");
            $table->integer("result_lt_longterm_line");

            $table->integer("result_recent_control_line");
            $table->integer("result_recent_verification_line");
            $table->integer("result_recent_longterm_line");

            $table->integer("result_negative_control_line");
            $table->integer("result_negative_verification_line");
            $table->integer("result_negative_longterm_line");

            $table->string("interpretation_longterm");
            $table->string("interpretation_recent");
            $table->string("interpretation_negative");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('submissions');
    }
}
