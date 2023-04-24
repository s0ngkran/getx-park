import 'package:flutter/material.dart';
import 'package:get/get.dart';

class GetXPark extends StatelessWidget {
  const GetXPark({super.key});

  @override
  Widget build(BuildContext context) {
    var controller = Get.find();
    return Scaffold(
      body: Column(
        children: [
          Obx(() {
            String priceText = controller.priceText.value;
            String price = controller.price.value;
            return Text(priceText + price);
          }),
          Obx(() {
            String currentShop = controller.currentShop.value;
            return Column(
              children: [
                ElevatedButton(
                  child:  Text('Get Price $currentShop'),
                  onPressed: () {
                    controller.getPrice();
                  },
                ),
                // add btn get taxFee
                ElevatedButton(
                  child:  Text('Get TaxFee $currentShop'),
                  onPressed: () {
                    controller.getTaxFee();
                  },
                ),
              ],
            );
          })
        ],
      ),
    );
  }
}
