import csv
import os

def csv_to_vcf(csv_file):
    contacts = []
    school_name = "contacts"

    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for i, row in enumerate(reader):
            # Get school name from first row
            if i == 0:
                school_name = row.get('school1', 'contacts').strip().replace(" ", "_")

            # Contact 1
            if row.get('name1') and row.get('contact1'):
                contacts.append({
                    "name": row['name1'],
                    "phone": row['contact1'],
                    "email": row.get('email1', ''),
                    "dob": row.get('dob1', ''),
                    "class": row.get('class1', '')
                })

            # Contact 2
            if row.get('name2') and row.get('contact2'):
                contacts.append({
                    "name": row['name2'],
                    "phone": row['contact2'],
                    "email": row.get('email2', ''),
                    "dob": row.get('dob2', ''),
                    "class": row.get('class2', '')
                })

    # Output file name
    vcf_filename = f"{school_name}.vcf"

    with open(vcf_filename, 'w', encoding='utf-8') as vcf:
        for c in contacts:
            vcf.write("BEGIN:VCARD\n")
            vcf.write("VERSION:3.0\n")
            vcf.write(f"N:{c['name']}\n")
            vcf.write(f"FN:{c['name']}\n")
            vcf.write(f"TEL;TYPE=CELL:{c['phone']}\n")

            if c['email']:
                vcf.write(f"EMAIL:{c['email']}\n")

            if c['dob']:
                vcf.write(f"BDAY:{c['dob']}\n")

            if c['class']:
                vcf.write(f"NOTE:Class {c['class']}\n")

            vcf.write("END:VCARD\n")

    print(f"✅ VCF file created: {vcf_filename}")


# 👉 Run here
if __name__ == "__main__":
    csv_file = input("Enter your CSV file name (e.g., contacts.csv): ").strip()
    
    if not os.path.exists(csv_file):
        print("❌ File not found!")
    else:
        csv_to_vcf(csv_file)