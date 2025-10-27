import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import connectDB from "@/lib/mongodb";
import { sendWhatsApp } from "@/lib/twilio";
import { templates } from "@/lib/messageTemplate";
import User from "@/model/user";
import Vendor from "@/model/vendor";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { customerClerkId, vendorId, service } = body ?? {};

    // checking the fields are coming or not
    if (!customerClerkId || !vendorId || !service) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const customerId = await User.findOne({ clerkId: customerClerkId });

    // check the id string is valid or not
    if (!ObjectId.isValid(customerId) || !ObjectId.isValid(vendorId)) {
      return NextResponse.json(
        { message: "Invalid customerId or vendorId" },
        { status: 400 }
      );
    }

    // find the customer {name, email} and vendor {ownerName, service_phone} from db
    const customer = await User.findById(customerId)
      .select("name email")
      .lean();

    const vendor = await Vendor.findById(vendorId)
      .select("ownerName service_phone")
      .lean();

    if (!customer || !vendor) {
      return NextResponse.json(
        { message: "Customer or vendor not found" },
        { status: 404 }
      );
    }

    let phone = vendor.service_phone;
    if (!phone) {
      return NextResponse.json(
        { message: "Vendor has no WhatsApp number" },
        { status: 400 }
      );
    }

    phone = String(phone).trim();
    const digits = phone.replace(/[^\d+]/g, "");

    //ensuring the number from India Continent
    phone = digits.startsWith("+91") ? digits : `+91${digits}`;

    const message = templates.vendorNotify({
      customerName: customer.name ?? "a customer",
      vendorName: vendor.ownerName ?? "Vendor",
      serviceName: service ?? " ",
    });

    await sendWhatsApp(phone, message);

    return NextResponse.json(
      { success: true, message: "Vendor notified via WhatsApp!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("notify/customer error:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
