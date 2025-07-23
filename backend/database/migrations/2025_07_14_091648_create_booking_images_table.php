<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('booking_images', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('booking_service_id');
        $table->string('image_path');
        $table->timestamps();

        $table->foreign('booking_service_id')
              ->references('id')
              ->on('booking_services')
              ->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('booking_images');
    }
};
