<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQcSubmissionResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qc_submission_results', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('qcsubmission_id');
            $table->string('type');
            $table->integer("control_line")->nullable();
            $table->integer("verification_line")->nullable();
            $table->integer("longterm_line")->nullable();
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
        Schema::dropIfExists('qc_submission_results');
    }
}
