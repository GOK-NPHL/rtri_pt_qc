<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRepeatSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('repeat_submissions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer("qcsubmissions_id");
            
            $table->integer("result_lt_control_line")->nullable();
            $table->integer("result_lt_verification_line")->nullable();
            $table->integer("result_lt_longterm_line")->nullable();

            $table->integer("result_recent_control_line")->nullable();
            $table->integer("result_recent_verification_line")->nullable();
            $table->integer("result_recent_longterm_line")->nullable();

            $table->integer("result_negative_control_line")->nullable();
            $table->integer("result_negative_verification_line")->nullable();
            $table->integer("result_negative_longterm_line")->nullable();

            $table->string("interpretation_longterm")->nullable();
            $table->string("interpretation_recent")->nullable();
            $table->string("interpretation_negative")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('repeat_submissions');
    }
}
