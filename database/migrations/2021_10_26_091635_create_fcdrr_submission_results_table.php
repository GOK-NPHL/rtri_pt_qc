<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFcdrrSubmissionResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fcdrr_submission_results', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer("submission_id");

            $table->string("comodity_name");
            $table->string("unit_of_issue");
            $table->integer("beggining_balance");
            $table->integer("qnty_received_kemsa");
            $table->integer("qnty_received_other_sources");
            $table->integer("qnty_used");

            $table->integer("no_of_tests_done");
            $table->integer("losses_damages");
            $table->integer("losses_errors");

            $table->integer("adjustments_positive");
            $table->integer("adjustments_negative");
            $table->integer("end_of_month_stock");
            $table->integer("days_out_of_stock");
            $table->integer("qnty_requested_resupply");
            $table->integer("qnty_expiry_six_months");
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fcdrr_submission_results');
    }
}
