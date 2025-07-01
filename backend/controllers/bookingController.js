const Booking = require('../models/Booking');

// 1. Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { productId, expertId, buyer, totalPrice } = req.body;

    const booking = new Booking({
      productId,
      expertId,
      buyer,
      totalPrice: totalPrice || 0,
      status: "pending",
    });

    await booking.save();

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating booking" });
  }
};

// 2. Get Bookings for Logged-In Expert
exports.getExpertBookings = async (req, res) => {
  try {
    const expertId = req.user._id;

    const bookings = await Booking.find({ expertId }).populate("productId");

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// 3. Accept Booking
exports.acceptBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const expertId = req.user._id;

    const booking = await Booking.findOne({ _id: bookingId, expertId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "accepted";
    await booking.save();

    res.status(200).json({
      message: "Booking accepted",
      whatsapp: booking.buyer.whatsapp,
    });
  } catch (err) {
    res.status(500).json({ message: "Error accepting booking" });
  }
};

const requireExpert = (req, res, next) => {
    if (req.user.role !== 'expert') {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
  