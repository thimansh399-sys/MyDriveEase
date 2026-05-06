import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart' show LatLng;

class BookingScreen extends StatefulWidget {
  final String userName;
  
  const BookingScreen({super.key, required this.userName});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  String _selectedService = "Local";
  final TextEditingController _fromController = TextEditingController();
  final TextEditingController _toController = TextEditingController();

  @override
  void dispose() {
    _fromController.dispose();
    _toController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0B0B0B),
      body: SafeArea(
        child: Column(
          children: [
            // 🗺️ Map Preview (OpenStreetMap)
            Expanded(
              flex: 2,
              child: ClipRRect(
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
child: FlutterMap(
                  options: MapOptions(
                    initialCenter: LatLng(28.6139, 77.2090), // Delhi
                    initialZoom: 12.0,
                  ),
children: [
                    TileLayer(
                      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      userAgentPackageName: 'com.driveease.app',
                    ),
                    MarkerLayer(
                      markers: [
                        // Pickup marker
                        Marker(
                          point: LatLng(28.6139, 77.2090),
                          width: 40,
                          height: 40,
                          child: Icon(
                            Icons.location_on,
                            color: Colors.green,
                            size: 40,
                          ),
                        ),
                        // Destination marker
                        Marker(
                          point: LatLng(28.6304, 77.2177),
                          width: 40,
                          height: 40,
                          child: Icon(
                            Icons.location_on,
                            color: Colors.orange,
                            size: 40,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // 📝 Booking Form
            Expanded(
              flex: 3,
              child: SingleChildScrollView(
                padding: EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 👋 Greeting
                    Text(
                      "Hi ${widget.userName} 👋",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "Where would you like to go?",
                      style: TextStyle(color: Colors.white70),
                    ),

                    SizedBox(height: 20),

                    // 🚗 Service Selection
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _serviceChip("Local", Icons.local_taxi),
                          _serviceChip("Airport", Icons.flight),
                          _serviceChip("Hourly", Icons.access_time),
                          _serviceChip("Outstation", Icons.map),
                        ],
                      ),
                    ),

                    SizedBox(height: 20),

                    // 📍 From Location
                    _locationField(
                      controller: _fromController,
                      icon: Icons.my_location,
                      hint: "Pickup location",
                      color: Colors.green,
                    ),

                    SizedBox(height: 12),

                    // 📍 To Location
                    _locationField(
                      controller: _toController,
                      icon: Icons.location_on,
                      hint: "Destination",
                      color: Colors.orange,
                    ),

                    SizedBox(height: 20),

                    // 🔍 Search Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () {
                          // Search for rides
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search, color: Colors.black),
                            SizedBox(width: 8),
                            Text(
                              "Find Drivers",
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _serviceChip(String label, IconData icon) {
    final isSelected = _selectedService == label;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedService = label;
        });
      },
      child: Container(
        margin: EdgeInsets.only(right: 12),
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? Colors.green : Colors.white10,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? Colors.green : Colors.white24,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.black : Colors.white54,
              size: 20,
            ),
            SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.black : Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _locationField({
    required TextEditingController controller,
    required IconData icon,
    required String hint,
    required Color color,
  }) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 15, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white10,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 24),
          SizedBox(width: 12),
          Expanded(
            child: TextField(
              controller: controller,
              style: TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: TextStyle(color: Colors.white38),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
