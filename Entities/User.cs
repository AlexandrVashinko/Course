namespace WebApplication1.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public string PhoneNumber { get; set; }
        public string PersonalNumber { get; set; }
    }
}