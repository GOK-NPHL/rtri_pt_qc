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
        Schema::create('qcsubmissions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->date("testing_date");
            $table->string("name_of_test");
            $table->string("kit_lot_no");
            $table->date("kit_date_received");
            $table->date("kit_expiry_date");

            $table->string("qc_lot_no");
            $table->date("lot_date_received");
            $table->date("sample_reconstituion_date");
            $table->integer("lab_id");
            $table->integer("user_id");
            $table->string("sample_type");
            $table->string("test_justification");

            $table->integer("qc_tested");
            $table->string("not_test_reason")->nullable();;
            $table->string("other_not_tested_reason")->nullable();

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
        Schema::dropIfExists('qcsubmissions');
    }
}
