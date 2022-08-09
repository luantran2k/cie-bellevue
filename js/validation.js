function Validation(string, options) {
    this.string = string;
    this.success = true;
    this.message = "";

    this.validate = function () {
        for (let option of options) {
            switch (option) {
                case "required":
                    if (!this.required(this.string)) {
                        this.success = false;
                        this.message = "Vui lòng nhập trường dữ liệu này";
                        return this.success;
                    }
                    break;
                case "phone":
                    if (!this.phoneValidate(this.string)) {
                        this.success = false;
                        this.message =
                            "Số điện thoại không hợp lệ, vui lòng nhập lại!";
                        return this.success;
                    }
                    break;
                case "email":
                    if (!this.emailValidate(this.string)) {
                        this.success = false;
                        this.message = "Email không hợp lệ, vui lòng nhập lại!";
                        return this.success;
                    }
                    break;
                default:
                    break;
            }
        }
        return this.success;
    };

    this.required = function () {
        if (this.string.trim()) {
            return true;
        } else {
            return false;
        }
    };

    this.phoneValidate = function (phoneNumber) {
        let regex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;
        return regex.test(phoneNumber);
    };

    this.emailValidate = function (email) {
        let regex =
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return regex.test(email);
    };

    this.minLength = function (string, minLength) {
        string = string.trim();
        if (string.length >= minLength) {
            return true;
        } else {
            return false;
        }
    };

    this.maxLength = function (string, maxLength) {
        string = string.trim();
        if (string.length <= maxLength) {
            return true;
        } else {
            return false;
        }
    };
}

export default Validation;
