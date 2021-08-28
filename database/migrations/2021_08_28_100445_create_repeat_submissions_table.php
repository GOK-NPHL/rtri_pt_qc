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

            $table->string("test_type");

            $table->integer("result_control_line")->nullable();
            $table->integer("result_verification_line")->nullable();
            $table->integer("result_longterm_line")->nullable();

            $table->string("interpretation")->nullable();

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
