<?php

use App\Admin;
use Illuminate\Database\Seeder;
use App\User;

class UserSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dataUser = array(

            array(
                'name' => 'duncan',
                'email' => 'duncanndiithi@yahoo.com',
                'password' => '$2y$10$wCyQ7j2mwl.NGD3brp1RSuCo3nIv9b1pDO4Cb8v0xjmfBshm93bGm',
                'created_at' => new \dateTime,
                'updated_at' => new \dateTime,
            )

        );


        $dataAdmin = array(
            array(
                'name' => 'duncan',
                'email' => 'duncanndiithi@gmail.com',
                'password' => '$2y$10$wCyQ7j2mwl.NGD3brp1RSuCo3nIv9b1pDO4Cb8v0xjmfBshm93bGm',
                'phone_number' => '0710238034',
                'created_at' => new \dateTime,
                'updated_at' => new \dateTime,
            )
        );


        $authObj = new User();
        User::query()->truncate();
        $authObj->insert($dataUser);

        $authObjAdmin = new Admin();
        Admin::query()->truncate();
        $authObjAdmin->insert($dataAdmin);
    }
}
